import { AggResponseTabifyProvider } from 'ui/agg_response/tabify/tabify';
import { uiModules } from 'ui/modules';
import { assign } from 'lodash';

// get the kibana/kbn_radar module, and make sure that it requires the "kibana" module if it
// didn't already
const module = uiModules.get('kibana/kbn_radar', ['kibana']);

// add a controller to tha module, which will transform the esResponse into a
// tabular format that we can pass to the table directive
module.controller('KbnRadarVisController', function ($scope, $element, $timeout, Private) {
  const tabifyAggResponse = Private(AggResponseTabifyProvider);

  const uiStateSort = ($scope.uiState) ? $scope.uiState.get('vis.params.sort') : {};
  assign($scope.vis.params.sort, uiStateSort);

  var Chartjs = require('chart.js');

  const randomColor = require('randomcolor');

  function normalize(val, max, min, scale) { return (scale * (val - min) / (max - min)); }
  function revertNormalize(final, max, min, scale) { return ((final / scale)*(max - min) + min); }


  $scope.$watchMulti(['esResponse'], function ([resp]) {
    // options
    const normalizeData = $scope.vis.params.normalize;
    const vertexMaxScale = $scope.vis.params.vertexScale.to;



    if($scope.radarchart){
      $scope.radarchart.destroy()
    }

    if(resp){
      var id_firstfield = '0'
      var id_secondfield;
      var id_x = '1'
      var id_y = '2'
      var id_size = '3'
      var dicColor = {}
      //Names of the field that have been selected
      if ($scope.vis.aggs.bySchemaName['field']) {
        var firstFieldAggId = $scope.vis.aggs.bySchemaName['field'][0].id;
        var fieldAggName = $scope.vis.aggs.bySchemaName['field'][0].params.field.displayName;
      }


      // Retrieve the metrics aggregation configured
      if($scope.vis.aggs.bySchemaName['vertex']){
        var titles = []
        var customLabels = []
        var quantityVertices = $scope.vis.aggs.bySchemaName['vertex'].length;
        for (let index = 0; index < $scope.vis.aggs.bySchemaName['vertex'].length; index++) {
          const metric = $scope.vis.aggs.bySchemaName['vertex'][index];

          titles.push(metric.type.title)

          if (metric.params.customLabel) {
            customLabels.push(metric.params.customLabel)
          } else {
            customLabels.push(metric.type.title)
          }
        }
      }

      //Coger valores metricas
      var valuesMetrics = {}
      for (let index = 0; index < resp.tables[0].rows.length; index++) {
        const bucket = resp.tables[0].rows[index];
        for (let index = 1; index < bucket.length; index++) {
          if (!valuesMetrics[index]){
            valuesMetrics[index] = []
          }
          valuesMetrics[index].push(bucket[index]);
        }
      }
      ///////

      var dataParsed = [];
      for (let index = 0; index < resp.tables[0].rows.length; index++) {
        const bucket = resp.tables[0].rows[index];
        var valuesBucket = []
        var originWithoutNormalize = []
        var label = bucket[0]
        for (let index = 1; index < bucket.length; index++) {
          if(normalizeData){
            var normMin = 1;
            var normMax = Math.max(...valuesMetrics[index]);
            
            if($scope.vis.params.rangesMetrics){
              if ($scope.vis.params.rangesMetrics[index - 1].from){
                normMin = $scope.vis.params.rangesMetrics[index - 1].from;
              }
              if ($scope.vis.params.rangesMetrics[index - 1].to) {
                normMax = $scope.vis.params.rangesMetrics[index - 1].to;
              }
            }
            valuesBucket.push(normalize(bucket[index], normMax, normMin, vertexMaxScale))
          }else{
            valuesBucket.push(bucket[index]);
          }
          originWithoutNormalize.push(bucket[index]);
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

      if(normalizeData){
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
                  if(v == value){
                    labelsWithSameValue.push(e.label)
                  }
                }

                //Draw good way
                var str = "";
                for (let index = 0; index < labelsWithSameValue.length; index++) {
                  const element = labelsWithSameValue[index];
                  if(index == labelsWithSameValue.length-1){
                    str += element;
                    continue
                  }
                  str += element + ", " 
                }
                return str + ": " + value ;
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
      }else{
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
                  if(v == value){
                    labelsWithSameValue.push(e.label)
                  }
                }

                //Draw good way
                var str = "";
                for (let index = 0; index < labelsWithSameValue.length; index++) {
                  const element = labelsWithSameValue[index];
                  if(index == labelsWithSameValue.length-1){
                    str += element;
                    continue
                  }
                  str += element + ", " 
                }
                return str + ": " + value ;
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
      Chartjs.defaults.global.legend.onClick = function(e, legendItem) {
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
});
