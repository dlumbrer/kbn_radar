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

import tableVisTemplate from './kbn-network-vis.html';
import { getKbnNetworkVisualizationController } from './vis_controller';
import { kbnNetworkRequestHandler } from './data_load/kbn-network-request-handler';
import { kbnNetworkResponseHandler } from './data_load/kbn-network-response-handler';
import { KbnNetworkOptions } from './components/kbn_network_vis_options_lazy';
import { VIS_EVENT_TO_TRIGGER } from '../../../src/plugins/visualizations/public';
import './index.scss'
import image from './images/icon-radar.svg';


// define the visType object, which kibana will use to display and configure new Vis object of this type.
export function kbnNetworkVisTypeDefinition(core, context) {
  return {
    type: 'radar',
    name: 'kbn_radar',
    title: i18n.translate('visTypeKbnNetwork.visTitle', {
      defaultMessage: 'Radar'
    }),
    icon: image,
    description: i18n.translate('visTypeKbnNetwork.visDescription', {
      defaultMessage: 'Spyder nets with the radar visualization'
    }),
    visualization: getKbnNetworkVisualizationController(core, context),
    getSupportedTriggers: () => {
      return [VIS_EVENT_TO_TRIGGER.filter];
    },
    visConfig: {
      defaults: {
        normalize: false,
        vertexScale: {from: 0, to: 5},
      },
      template: tableVisTemplate
    },
    editorConfig: {
      optionsTemplate: KbnNetworkOptions,
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
    requestHandler: kbnNetworkRequestHandler,
    responseHandler: kbnNetworkResponseHandler,
    hierarchicalData: (vis) => {
      return true;
    }
  };
}
