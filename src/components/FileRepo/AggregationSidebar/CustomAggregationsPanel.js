import React from 'react';
import { compose } from 'recompose';
import { injectState } from 'freactal';
import Component from 'react-component-component';

import { AggregationsList } from '@kfarranger/components/dist/Arranger';
import Query from '@kfarranger/components/dist/Query';

import { CLINICAL_FILTERS, FILE_FILTERS } from './aggsConfig';
import { withApi } from 'services/api';
import Column from 'uikit/Column';
import QuickSearchBox from './QuickSearchBox';
import { FilterInput } from '../../../uikit/Input';

import Tabs, { ShowIf } from 'components/Tabs';

import styles from './AggregationSidebar.module.css';

const ScrollY = ({ children, className = '', ...props }) => (
  <div className={`${styles.scrollY} ${className}`} {...props}>
    {children}
  </div>
);

export default compose(
  injectState,
  withApi,
)(
  ({
    api,
    sqon,
    containerRef,
    setSQON = () => {},
    onValueChange = () => {},
    projectId,
    graphqlField,
    translateSQONValue,
    state,
    effects,
    hidden = false,
    ...props
  }) => (
    <Component initialState={{ selectedTab: 'CLINICAL' }}>
      {({ state: { selectedTab }, setState }) => (
        // css rather than conditional rendering to prevent rerender
        <div className={`${styles.aggregationPanelContainer} ${hidden ? 'hidden' : ''} `}>
          <Tabs
            selectedTab={selectedTab}
            options={[
              { id: 'CLINICAL', display: 'Clinical Filters' },
              { id: 'FILE', display: 'File Filters' },
            ]}
            onTabSelect={id => setState({ selectedTab: id })}
          />
          <div className={styles.aggsListWrapper}>
            <ScrollY>
              <Query
                renderError
                shouldFetch={true}
                api={api}
                projectId={projectId}
                name={`aggsIntrospection`}
                query={`
                  query dataTypes {
                    __schema {
                      types {
                        name
                        fields {
                          name
                          type {
                            name
                          }
                        }
                      }
                    }
                  }
                `}
                render={({ loading, data }) => {
                  const containerRef = React.createRef();
                  if (data) {
                    const {
                      __schema: { types },
                    } = data;
                    const gqlAggregationFields = types.find(
                      ({ name }) => name === `${graphqlField}Aggregations`,
                    ).fields;
                    const extendAggsConfig = fieldNames => {
                      return fieldNames.map(fieldName => ({
                        field: fieldName,
                        show: true,
                        type: gqlAggregationFields.find(
                          fileAggField => fieldName === fileAggField.name,
                        ).type.name,
                      }));
                    };
                    const renderAggsConfig = ({ aggConfig, quickSearchFields = [] }) => (
                      <AggregationsList
                        {...{
                          onValueChange: onValueChange,
                          setSQON: setSQON,
                          sqon,
                          projectId,
                          graphqlField,
                          api,
                          containerRef,
                          aggs: aggConfig,
                          debounceTime: 300,
                          componentProps: {
                            getTermAggProps: () => ({
                              InputComponent: FilterInput,
                              headerTitle: '# files',
                            }),
                          },
                          getCustomItems: ({ aggs }) =>
                            quickSearchFields.map(
                              (
                                {
                                  entityField,
                                  header,
                                  uploadableField,
                                  inputPlaceholder,
                                  modalTitle,
                                },
                                i,
                              ) => ({
                                index: aggs.length,
                                component: () => (
                                  <QuickSearchBox
                                    key={`${entityField}_${i}`}
                                    uploadableFields={[uploadableField]}
                                    inputPlaceholder={inputPlaceholder}
                                    whitelist={[entityField]}
                                    matchboxPlaceholderText={inputPlaceholder}
                                    {...{
                                      modalTitle,
                                      graphqlField,
                                      header,
                                      setSQON,
                                      translateSQONValue,
                                      projectId,
                                      ...props,
                                    }}
                                  />
                                ),
                              }),
                            ),
                        }}
                      />
                    );
                    return (
                      <Column w="100%">
                        <Column innerRef={containerRef}>
                          <ShowIf condition={selectedTab === 'FILE'}>
                            {renderAggsConfig({
                              aggConfig: extendAggsConfig(FILE_FILTERS),
                              quickSearchFields: [
                                {
                                  header: 'Search by File ID',
                                  entityField: '', // "" denotes root level entity
                                  uploadableField: 'kf_id',
                                  inputPlaceholder: 'Eg. GF_851CMY87',
                                },
                              ],
                            })}
                          </ShowIf>
                          <ShowIf condition={selectedTab === 'CLINICAL'}>
                            {renderAggsConfig({
                              aggConfig: extendAggsConfig(CLINICAL_FILTERS),
                              quickSearchFields: [
                                {
                                  header: 'Search Files by Biospecimen ID',
                                  entityField: 'participants.biospecimens',
                                  uploadableField: 'participants.biospecimens.kf_id',
                                  inputPlaceholder: 'Eg. BS_4F9171D5, S88-3',
                                },
                                {
                                  header: 'Search Files by Participant ID',
                                  entityField: 'participants',
                                  uploadableField: 'participants.kf_id',
                                  inputPlaceholder: 'Eg. PT_RR05KSJC',
                                },
                              ],
                            })}
                          </ShowIf>
                        </Column>
                      </Column>
                    );
                  } else {
                    return null;
                  }
                }}
              />
            </ScrollY>
          </div>
        </div>
      )}
    </Component>
  ),
);
