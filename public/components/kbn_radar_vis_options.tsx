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

import { some } from 'lodash';
import React, { useEffect } from 'react';
import { i18n } from '@kbn/i18n';
import { FormattedMessage } from '@kbn/i18n/react';
import { EuiButtonEmpty, EuiDragDropContext, euiDragDropReorder, EuiDroppable, EuiFlexGroup, EuiFlexItem, EuiFormErrorText, EuiIconTip, EuiPanel, EuiSpacer, EuiTitle } from '@elastic/eui';

import { IAggConfigs } from '../../../../src/plugins/data/public';
import { VisOptionsProps } from '../../../../src/plugins/vis_default_editor/public';
import { NumberInputOption, SelectOption } from '../../../../src/plugins/charts/public';
import { SwitchOption } from './switch';
import { TextInputOption } from './text_input';
import { totalAggregations, AggTypes } from './utils';
import { array } from 'fp-ts';


export interface KbnRadarVisParams {
  type: 'radar';
  normalize: boolean;
  vertexScaleTo: number | '';
  rangesMetrics_0_from: number | '',
  rangesMetrics_0_to: number | '',
  rangesMetrics_1_from: number | '',
  rangesMetrics_1_to: number | '',
  rangesMetrics_2_from: number | '',
  rangesMetrics_2_to: number | '',
  rangesMetrics_3_from: number | '',
  rangesMetrics_3_to: number | '',
  rangesMetrics_4_from: number | '',
  rangesMetrics_4_to: number | '',
  rangesMetrics_5_from: number | '',
  rangesMetrics_5_to: number | '',
  rangesMetrics_6_from: number | '',
  rangesMetrics_6_to: number | '',
  rangesMetrics_7_from: number | '',
  rangesMetrics_7_to: number | '',
  rangesMetrics_8_from: number | '',
  rangesMetrics_8_to: number | '',
  rangesMetrics_9_from: number | '',
  rangesMetrics_9_to: number | '',
}

function KbnRadarOptions({
  stateParams,
  setValue,
}: VisOptionsProps<KbnRadarVisParams>) {

  return (
    <div className="kbn-radar-vis-params">

      <EuiPanel paddingSize="s">
        <EuiTitle size="xs">
          <h3>
            <FormattedMessage
              id="visTypeKbnRadar.params.radarSettingsSection"
              defaultMessage="Radar Settings"
            />
          </h3>
        </EuiTitle>
        <EuiSpacer size="m" />

        <SwitchOption
          label={i18n.translate('visTypeKbnRadar.params.normalize', {
            defaultMessage: 'Normalize data',
          })}
          paramName="normalize"
          value={stateParams.normalize}
          setValue={setValue}
        />
        <EuiSpacer size="m" />

        {stateParams.normalize &&
        <div>
          <NumberInputOption
            label={
              <>
                <FormattedMessage
                  id="visTypeTable.params.vertexScaleTo"
                  defaultMessage="Vertex max scale (if normalized)"
                />{' '}
              </>
            }
            paramName="vertexScaleTo"
            value={stateParams.vertexScaleTo}
            setValue={setValue}
          />
          <EuiSpacer size="m" />
          <EuiSpacer size="m" />
          <h3>
            <FormattedMessage
              id="visTypeKbnRadar.params.radarVertexSettingsSection"
              defaultMessage="Vertex normalized values, starting on the top one and moving clockwise"
            />
          </h3>
          <EuiSpacer size="m" />

          <NumberInputOption
            label={
              <>
                <FormattedMessage
                  id="visTypeTable.params.rangesMetrics_0_from"
                  defaultMessage="Range 'from' of vertex 0"
                />{' '}
              </>
            }
            paramName="rangesMetrics_0_from"
            value={stateParams.rangesMetrics_0_from}
            setValue={setValue}
          />
          <NumberInputOption
            label={
              <>
                <FormattedMessage
                  id="visTypeTable.params.rangesMetrics_0_to"
                  defaultMessage="Range 'to' of vertex 0"
                />{' '}
              </>
            }
            paramName="rangesMetrics_0_to"
            value={stateParams.rangesMetrics_0_to}
            setValue={setValue}
          />
          <EuiSpacer size="m" />
          <EuiSpacer size="m" />
          <EuiSpacer size="m" />

          <NumberInputOption
            label={
              <>
                <FormattedMessage
                  id="visTypeTable.params.rangesMetrics_1_from"
                  defaultMessage="Range 'from' of vertex 1"
                />{' '}
              </>
            }
            paramName="rangesMetrics_1_from"
            value={stateParams.rangesMetrics_1_from}
            setValue={setValue}
          />
          <NumberInputOption
            label={
              <>
                <FormattedMessage
                  id="visTypeTable.params.rangesMetrics_1_to"
                  defaultMessage="Range 'to' of vertex 1"
                />{' '}
              </>
            }
            paramName="rangesMetrics_1_to"
            value={stateParams.rangesMetrics_1_to}
            setValue={setValue}
          />
          <EuiSpacer size="m" />
          <EuiSpacer size="m" />
          <EuiSpacer size="m" />

          <NumberInputOption
            label={
              <>
                <FormattedMessage
                  id="visTypeTable.params.rangesMetrics_2_from"
                  defaultMessage="Range 'from' of vertex 2"
                />{' '}
              </>
            }
            paramName="rangesMetrics_2_from"
            value={stateParams.rangesMetrics_2_from}
            setValue={setValue}
          />
          <NumberInputOption
            label={
              <>
                <FormattedMessage
                  id="visTypeTable.params.rangesMetrics_2_to"
                  defaultMessage="Range 'to' of vertex 2"
                />{' '}
              </>
            }
            paramName="rangesMetrics_2_to"
            value={stateParams.rangesMetrics_2_to}
            setValue={setValue}
          />
          <EuiSpacer size="m" />
          <EuiSpacer size="m" />
          <EuiSpacer size="m" />

          <NumberInputOption
            label={
              <>
                <FormattedMessage
                  id="visTypeTable.params.rangesMetrics_3_from"
                  defaultMessage="Range 'from' of vertex 3"
                />{' '}
              </>
            }
            paramName="rangesMetrics_3_from"
            value={stateParams.rangesMetrics_3_from}
            setValue={setValue}
          />
          <NumberInputOption
            label={
              <>
                <FormattedMessage
                  id="visTypeTable.params.rangesMetrics_3_to"
                  defaultMessage="Range 'to' of vertex 3"
                />{' '}
              </>
            }
            paramName="rangesMetrics_3_to"
            value={stateParams.rangesMetrics_3_to}
            setValue={setValue}
          />
          <EuiSpacer size="m" />
          <EuiSpacer size="m" />
          <EuiSpacer size="m" />

          <NumberInputOption
            label={
              <>
                <FormattedMessage
                  id="visTypeTable.params.rangesMetrics_4_from"
                  defaultMessage="Range 'from' of vertex 4"
                />{' '}
              </>
            }
            paramName="rangesMetrics_4_from"
            value={stateParams.rangesMetrics_4_from}
            setValue={setValue}
          />
          <NumberInputOption
            label={
              <>
                <FormattedMessage
                  id="visTypeTable.params.rangesMetrics_4_to"
                  defaultMessage="Range 'to' of vertex 4"
                />{' '}
              </>
            }
            paramName="rangesMetrics_4_to"
            value={stateParams.rangesMetrics_4_to}
            setValue={setValue}
          />
          <EuiSpacer size="m" />
          <EuiSpacer size="m" />
          <EuiSpacer size="m" />

          <NumberInputOption
            label={
              <>
                <FormattedMessage
                  id="visTypeTable.params.rangesMetrics_5_from"
                  defaultMessage="Range 'from' of vertex 5"
                />{' '}
              </>
            }
            paramName="rangesMetrics_5_from"
            value={stateParams.rangesMetrics_5_from}
            setValue={setValue}
          />
          <NumberInputOption
            label={
              <>
                <FormattedMessage
                  id="visTypeTable.params.rangesMetrics_5_to"
                  defaultMessage="Range 'to' of vertex 5"
                />{' '}
              </>
            }
            paramName="rangesMetrics_5_to"
            value={stateParams.rangesMetrics_5_to}
            setValue={setValue}
          />
          <EuiSpacer size="m" />
          <EuiSpacer size="m" />
          <EuiSpacer size="m" />

          <NumberInputOption
            label={
              <>
                <FormattedMessage
                  id="visTypeTable.params.rangesMetrics_6_from"
                  defaultMessage="Range 'from' of vertex 6"
                />{' '}
              </>
            }
            paramName="rangesMetrics_6_from"
            value={stateParams.rangesMetrics_6_from}
            setValue={setValue}
          />
          <NumberInputOption
            label={
              <>
                <FormattedMessage
                  id="visTypeTable.params.rangesMetrics_6_to"
                  defaultMessage="Range 'to' of vertex 6"
                />{' '}
              </>
            }
            paramName="rangesMetrics_6_to"
            value={stateParams.rangesMetrics_6_to}
            setValue={setValue}
          />
          <EuiSpacer size="m" />
          <EuiSpacer size="m" />
          <EuiSpacer size="m" />

          <NumberInputOption
            label={
              <>
                <FormattedMessage
                  id="visTypeTable.params.rangesMetrics_7_from"
                  defaultMessage="Range 'from' of vertex 7"
                />{' '}
              </>
            }
            paramName="rangesMetrics_7_from"
            value={stateParams.rangesMetrics_7_from}
            setValue={setValue}
          />
          <NumberInputOption
            label={
              <>
                <FormattedMessage
                  id="visTypeTable.params.rangesMetrics_7_to"
                  defaultMessage="Range 'to' of vertex 7"
                />{' '}
              </>
            }
            paramName="rangesMetrics_7_to"
            value={stateParams.rangesMetrics_7_to}
            setValue={setValue}
          />
          <EuiSpacer size="m" />
          <EuiSpacer size="m" />
          <EuiSpacer size="m" />

          <NumberInputOption
            label={
              <>
                <FormattedMessage
                  id="visTypeTable.params.rangesMetrics_8_from"
                  defaultMessage="Range 'from' of vertex 8"
                />{' '}
              </>
            }
            paramName="rangesMetrics_8_from"
            value={stateParams.rangesMetrics_8_from}
            setValue={setValue}
          />
          <NumberInputOption
            label={
              <>
                <FormattedMessage
                  id="visTypeTable.params.rangesMetrics_8_to"
                  defaultMessage="Range 'to' of vertex 8"
                />{' '}
              </>
            }
            paramName="rangesMetrics_8_to"
            value={stateParams.rangesMetrics_8_to}
            setValue={setValue}
          />
          <EuiSpacer size="m" />
          <EuiSpacer size="m" />
          <EuiSpacer size="m" />

          <NumberInputOption
            label={
              <>
                <FormattedMessage
                  id="visTypeTable.params.rangesMetrics_9_from"
                  defaultMessage="Range 'from' of vertex 9"
                />{' '}
              </>
            }
            paramName="rangesMetrics_9_from"
            value={stateParams.rangesMetrics_9_from}
            setValue={setValue}
          />
          <NumberInputOption
            label={
              <>
                <FormattedMessage
                  id="visTypeTable.params.rangesMetrics_9_to"
                  defaultMessage="Range 'to' of vertex 9"
                />{' '}
              </>
            }
            paramName="rangesMetrics_9_to"
            value={stateParams.rangesMetrics_9_to}
            setValue={setValue}
          />

          </div>
        }



      </EuiPanel>
      {/* /NETOWRK SETTINGS SECTION */}

      <EuiSpacer size="m" />

    </div>
  );
}

// default export required for React.Lazy
// eslint-disable-next-line import/no-default-export
export { KbnRadarOptions as default };
