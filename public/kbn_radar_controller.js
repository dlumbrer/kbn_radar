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

  $scope.$watchMulti(['esResponse'], function ([resp]) {
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
      if($scope.vis.aggs.bySchemaName['sommet']){
        var fields = []
        var titles = []
        var customLabels = []
        var quantitySommets = $scope.vis.aggs.bySchemaName['sommet'].length;
        for (let index = 0; index < $scope.vis.aggs.bySchemaName['sommet'].length; index++) {
          const metric = $scope.vis.aggs.bySchemaName['sommet'][index];

          if (metric.type.name != "count") {
            fields.push(metric.params.field.displayName)
          } else {
            fields.push("")
          }
          titles.push(metric.type.title)

          if (metric.params.customLabel) {
            customLabels.push(metric.params.customLabel)
          } else {
            customLabels.push(metric.type.title + " " + fields[fields.length-1])
          }
        }
      }

      var dataParsed = [];
      for (let index = 0; index < resp.tables[0].rows.length; index++) {
        const bucket = resp.tables[0].rows[index];
        var valuesBucket = []
        var label = bucket[0]
        for (let index = 1; index < bucket.length; index++) {
          valuesBucket.push(bucket[index])
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

      var data = {
        labels: ['Running', 'Swimming', 'Eating', 'Cycling'],
          datasets: [{
            data: [20, 10, 14, 12]
          }]
      }
      var options = {
        scale: {
          // Hides the scale
          display: true
        }
      };

      $scope.radarchart = new Chartjs(ctx, {
        data: dataComplete,
        type: 'radar',
        options: options
      });
    });



  });
});
