import 'plugins/kbn_radar/kbn_radar.less';
import 'plugins/kbn_radar/kbn_radar_controller';
import 'plugins/kbn_radar/kbn_radar_params';
import 'ui/agg_table';
import 'ui/agg_table/agg_table_group';
import 'ui/agg_table';
import 'ui/agg_table/agg_table_group';

import { CATEGORY } from 'ui/vis/vis_category';
import { VisFactoryProvider } from 'ui/vis/vis_factory';
import { VisSchemasProvider } from 'ui/vis/editors/default/schemas';
import RadarVisTemplate from 'plugins/kbn_radar/kbn_radar.html';
import { VisTypesRegistryProvider } from 'ui/registry/vis_types';
import image from './images/radar.svg';
// we need to load the css ourselves

// we also need to load the controller and used by the template

// our params are a bit complex so we will manage them with a directive

// require the directives that we use as well

// register the provider with the visTypes registry
VisTypesRegistryProvider.register(RadarVisTypeProvider);

// define the RadarVisType
function RadarVisTypeProvider(Private) {
  const VisFactory = Private(VisFactoryProvider);
  const Schemas = Private(VisSchemasProvider);

  // define the RadarVisController which is used in the template
  // by angular's ng-controller directive

  // return the visType object, which kibana will use to display and configure new
  // Vis object of this type.
  return VisFactory.createAngularVisualization({
    name: 'radar',
    title: 'Radar',
    image,
    description: 'Display values in a radar chart',
      category: CATEGORY.BASIC,
    visConfig: {
      defaults: {
        normalize: false,
        vertexScale: {from: 0, to: 5},
      },
      template: RadarVisTemplate
    },
    editorConfig: {
      optionsTemplate: '<kbn-radar-params></kbn-radar-params>',
      schemas: new Schemas([
        {
          group: 'metrics',
          name: 'vertex',
          title: 'Vertex',
          aggFilter: '!geo_centroid',
          min: 1,
        },
        {
          group: 'buckets',
          name: 'field',
          title: 'Field',
          max: 1,
          min: 1,
          aggFilter: ['terms']
        }
      ])
    },
    implementsRenderComplete: true,
    hierarchicalData: function (vis) {
      return true;
    }

  });
}

export default RadarVisTypeProvider;
