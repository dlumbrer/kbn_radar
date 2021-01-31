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

import { i18n } from '@kbn/i18n';
import { AggGroupNames } from '../../../src/plugins/data/public';
import { Schemas } from '../../../src/plugins/vis_default_editor/public';

import tableVisTemplate from './kbn-radar-vis.html';
import { getKbnRadarVisualizationController } from './vis_controller';
import { kbnRadarRequestHandler } from './data_load/kbn-radar-request-handler';
import { kbnRadarResponseHandler } from './data_load/kbn-radar-response-handler';
import { KbnRadarOptions } from './components/kbn_radar_vis_options_lazy';
import { VIS_EVENT_TO_TRIGGER } from '../../../src/plugins/visualizations/public';
import './index.scss'
import image from './images/icon-radar.svg';


// define the visType object, which kibana will use to display and configure new Vis object of this type.
export function kbnRadarVisTypeDefinition(core, context) {
  return {
    type: 'radar',
    name: 'kbn_radar',
    title: i18n.translate('visTypeKbnRadar.visTitle', {
      defaultMessage: 'Radar'
    }),
    icon: image,
    description: i18n.translate('visTypeKbnRadar.visDescription', {
      defaultMessage: 'Spyder nets with the radar visualization'
    }),
    visualization: getKbnRadarVisualizationController(core, context),
    getSupportedTriggers: () => {
      return [VIS_EVENT_TO_TRIGGER.filter];
    },
    visConfig: {
      defaults: {
        normalize: false,
        vertexScaleTo: 5,
        rangesMetrics_0_from: 0,
        rangesMetrics_0_to: 100,
        rangesMetrics_1_from: 0,
        rangesMetrics_1_to: 100,
        rangesMetrics_2_from: 0,
        rangesMetrics_2_to: 100,
        rangesMetrics_3_from: 0,
        rangesMetrics_3_to: 100,
        rangesMetrics_4_from: 0,
        rangesMetrics_4_to: 100,
        rangesMetrics_5_from: 0,
        rangesMetrics_5_to: 100,
        rangesMetrics_6_from: 0,
        rangesMetrics_6_to: 100,
        rangesMetrics_7_from: 0,
        rangesMetrics_7_to: 100,
        rangesMetrics_8_from: 0,
        rangesMetrics_8_to: 100,
        rangesMetrics_9_from: 0,
        rangesMetrics_9_to: 100,
      },
      template: tableVisTemplate
    },
    editorConfig: {
      optionsTemplate: KbnRadarOptions,
      schemas: new Schemas([
        {
          group: AggGroupNames.Metrics,
          name: 'vertex',
          title: 'Vertex',
          aggFilter: ['!geo_centroid', '!geo_bounds'],
          aggSettings: {
            top_hits: {
              allowStrings: false
            }
          },
          min: 1,
          max: 10,
          defaults: [{ type: 'count', schema: 'vertex' }]
        },
        {
          group: AggGroupNames.Buckets,
          name: 'field',
          title: "Field",
          min: 1,
          max: 1,
          aggFilter: ['terms', 'filters']
        }
      ])
    },
    implementsRenderComplete: true,
    requestHandler: kbnRadarRequestHandler,
    responseHandler: kbnRadarResponseHandler,
    hierarchicalData: (vis) => {
      return true;
    }
  };
}
