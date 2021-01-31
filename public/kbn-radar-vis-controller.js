/*
 * Licensed to Elasticsearch B.V. under one or more contributor
 * license agreements. See the NOTICE file distributed with
 * this work for additional information regarding copyright
 * ownership. Elasticsearch B.V. licenses this file to you under
 * the Apache License, Version 2.0 (the "License"); you may
 * not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *    http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied.  See the License for the
 * specific language governing permissions and limitations
 * under the License.
 */

import _ from 'lodash';

import randomColor from 'randomcolor';
import Chartjs from 'chart.js'

import AggConfigResult from './data_load/agg_config_result';
import { getNotifications, getFormatService } from './services';

// KbnRadarVis AngularJS controller
function KbnRadarVisController($scope, config, $timeout) {

  function normalize(val, max, min, scale) { return (scale * (val - min) / (max - min)); }
  function revertNormalize(final, max, min, scale) { return ((final / scale) * (max - min) + min); }


  $scope.$watchMulti(['esResponse'], function ([resp]) {
    // options
    const normalizeData = $scope.visParams.normalize;
    const vertexMaxScale = $scope.visParams.vertexScaleTo;



    if ($scope.radarchart) {
      $scope.radarchart.destroy()
    }

    if (resp) {
      var id_firstfield = '0'
      var id_secondfield;
      var id_x = '1'
      var id_y = '2'
      var id_size = '3'
      var dicColor = {}
      //Names of the field that have been selected
      if (resp.aggs.bySchemaName('field')) {
        var firstFieldAggId = resp.aggs.bySchemaName('field')[0].id;
        if (resp.aggs.bySchemaName('field')[0].params.field) {
          var fieldAggName = resp.aggs.bySchemaName('field')[0].params.field.displayName;
        }
      }


      // Retrieve the metrics aggregation configured
      if (resp.aggs.bySchemaName('vertex')) {
        var titles = []
        var customLabels = []
        var quantityVertices = resp.aggs.bySchemaName('vertex').length;
        for (let index = 0; index < resp.aggs.bySchemaName('vertex').length; index++) {
          const metric = resp.aggs.bySchemaName('vertex')[index];

          titles.push(metric.type.title)

          if (metric.params.customLabel) {
            customLabels.push(metric.params.customLabel)
          } else {
            customLabels.push(metric.type.title)
          }
        }
      }

      let metricIds = []
      resp.aggs.bySchemaName('vertex').forEach(e => {
        metricIds.push(e.id)
      });

      //Coger valores metricas
      var valuesMetrics = {}
      for (let index = 0; index < resp.tables[0].rows.length; index++) {
        const bucket = resp.tables[0].rows[index];
        for (let i = 0; i < metricIds.length; i++) {
          if (!valuesMetrics[i + 1]) {
            valuesMetrics[i + 1] = []
          }
          let k = i + 1
          //Pick metric if exist
          if (bucket['col-' + k + '-' + metricIds[i]]) {
            valuesMetrics[i + 1].push(bucket['col-' + k + '-' + metricIds[i]])
          }
        }
      }
      ///////

      var dataParsed = [];
      for (let index = 0; index < resp.tables[0].rows.length; index++) {
        const bucket = resp.tables[0].rows[index];
        var valuesBucket = []
        var originWithoutNormalize = []
        var label = bucket['col-0-' + resp.aggs.bySchemaName('field')[0].id]
        for (let index = 1; index < Object.keys(bucket).length; index++) {
          if (normalizeData && valuesMetrics[index]) {
            var normMin = 1;
            var normMax = Math.max(...valuesMetrics[index]);

            if ($scope.visParams['rangesMetrics_' + (index - 1) + '_from']) {
              normMin = $scope.visParams['rangesMetrics_' + (index - 1) + '_from'];
            }
            if ($scope.visParams['rangesMetrics_' + (index - 1) + '_to']) {
              normMax = $scope.visParams['rangesMetrics_' + (index - 1) + '_to'];
            }
            // Just pick the metric if exist
            if (bucket['col-' + index + '-' + metricIds[index - 1]]) {
              valuesBucket.push(normalize(bucket['col-' + index + '-' + metricIds[index - 1]], normMax, normMin, vertexMaxScale))
            }
          } else {
            // Just pick the metric if exist
            if (bucket['col-' + index + '-' + metricIds[index - 1]]) {
              valuesBucket.push(bucket['col-' + index + '-' + metricIds[index - 1]]);
            }
          }
          // Just pick the metric if exist
          if (bucket['col-' + index + '-' + metricIds[index - 1]]) {
            originWithoutNormalize.push(bucket['col-' + index + '-' + metricIds[index - 1]]);
          }
        }
        var color = randomColor({
          luminosity: 'light',
          format: 'rgba',
          alpha: 0.2
        });
        // Border color must have a complete alpha
        var borderColor = color.replace(/[^,]+(?=\))/, '1')
        var bucketArea = {
          label: label,
          data: valuesBucket,
          dataOrig: originWithoutNormalize,
          backgroundColor: color,
          borderColor: borderColor,
          pointBackgroundColor: borderColor,
          pointBorderColor: "#fff"
        }
        dataParsed.push(bucketArea)
      }
      // Colors and data compelte with the dataParsed and the labels
      var dataComplete = {
        datasets: dataParsed,
        labels: customLabels
      }
    }

    $timeout(function () {
      //DOM has finished rendering
      var canvas = document.getElementById('radar_chart_' + $scope.$id);
      var ctx = canvas.getContext('2d');
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      var parent = document.getElementById('radar-chart_' + $scope.$id);
      canvas.width = parent.offsetWidth - 30;
      canvas.height = parent.offsetHeight;

      // if the data is normalizated, It is neccesary to change the tooltip and scale

      if (normalizeData) {
        var options = {
          responsive: true,
          maintainAspectRadio: false,
          scale: {
            reverse: false,
            ticks: {
              beginAtZero: true,
              min: 0,
              max: vertexMaxScale
            },
          },
          tooltips: {
            callbacks: {
              label: function (tooltipItem, data) {
                var dataset = data['datasets'][tooltipItem['datasetIndex']];
                var value = dataset['dataOrig'][tooltipItem['index']];
                var labelsWithSameValue = []
                for (let i = 0; i < data['datasets'].length; i++) {
                  const e = data['datasets'][i];
                  var v = e['dataOrig'][tooltipItem['index']];
                  if (v == value) {
                    labelsWithSameValue.push(e.label)
                  }
                }

                //Draw good way
                var str = "";
                for (let index = 0; index < labelsWithSameValue.length; index++) {
                  const element = labelsWithSameValue[index];
                  if (index == labelsWithSameValue.length - 1) {
                    str += element;
                    continue
                  }
                  str += element + ", "
                }
                return str + ": " + value;
              },
              afterLabel: function (tooltipItem, data) {
                var dataset = data['datasets'][tooltipItem['datasetIndex']];
                var value = dataset['data'][tooltipItem['index']];
                return 'Normalizated value: ' + value;
              }
            },
            backgroundColor: '#000',
            titleFontSize: 16,
            titleFontColor: '#FFF',
            bodyFontColor: '#FFF',
            bodyFontSize: 14,
            displayColors: false
          }
        };
      } else {
        var options = {
          responsive: true,
          maintainAspectRadio: false,
          scale: {
            reverse: false,
            ticks: {
              beginAtZero: true,
              min: 0
            },
          },
          tooltips: {
            callbacks: {
              label: function (tooltipItem, data) {
                var dataset = data['datasets'][tooltipItem['datasetIndex']];
                var value = dataset['data'][tooltipItem['index']];
                var labelsWithSameValue = []
                for (let i = 0; i < data['datasets'].length; i++) {
                  const e = data['datasets'][i];
                  var v = e['data'][tooltipItem['index']];
                  if (v == value) {
                    labelsWithSameValue.push(e.label)
                  }
                }

                //Draw good way
                var str = "";
                for (let index = 0; index < labelsWithSameValue.length; index++) {
                  const element = labelsWithSameValue[index];
                  if (index == labelsWithSameValue.length - 1) {
                    str += element;
                    continue
                  }
                  str += element + ", "
                }
                return str + ": " + value;
              }
            },
            backgroundColor: '#000',
            titleFontSize: 16,
            titleFontColor: '#FFF',
            bodyFontColor: '#FFF',
            bodyFontSize: 14,
            displayColors: false
          }
        };
      }

      var original = Chart.defaults.global.legend.onClick;
      Chartjs.defaults.global.legend.onClick = function (e, legendItem) {
        console.log(e, legendItem);
        original.call(this, e, legendItem);
      };

      $scope.radarchart = new Chartjs(ctx, {
        data: dataComplete,
        type: 'radar',
        options: options
      });
    });



  });

}

export { KbnRadarVisController };