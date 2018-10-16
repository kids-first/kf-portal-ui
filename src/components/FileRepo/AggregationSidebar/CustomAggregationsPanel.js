import React, { Fragment } from 'react';
import { compose } from 'recompose';
import { injectState } from 'freactal';
import { withTheme } from 'emotion-theming';
import Component from 'react-component-component';
import Spinner from 'react-spinkit';
import styled from 'react-emotion';

import { AggregationsList, QuickSearch, AggsWrapper } from '@arranger/components/dist/Arranger';
import Query from '@arranger/components/dist/Query';

import { CLINICAL_FILTERS, FILE_FILTERS } from './aggsConfig';
import { withApi } from 'services/api';
import Row from 'uikit/Row';
import Column from 'uikit/Column';
import { Span } from 'uikit/Core';
import { FilterInput } from 'uikit/Input';
import UploadIdsButton from './UploadIdsButton';

const IdFilterContainer = styled(Column)`
  margin-top: 0px;

  .quick-search {
    margin-bottom: 10px;
  }
`;

const TabsRow = styled(({ className, ...props }) => (
  <Row flexStrink={0} {...props} className={`${className} tabs-titles`} />
))`
  padding-left: 10px;
  border-bottom: solid 3px ${({ theme }) => theme.primaryHover};
  text-align: center;
  font-size: 14px;
`;
const Tab = styled(({ className, selected, ...props }) => (
  <Row
    {...props}
    center
    width={'100%'}
    className={`tabs-title ${className} ${selected ? 'active-tab' : ''}`}
  />
))`
  padding: 5px;
`;

const Tabs = ({ selectedTab, onTabSelect, options }) => (
  <TabsRow>
    {options.map(({ id, display }) => (
      <Tab onClick={() => onTabSelect({ id })} selected={selectedTab === id}>
        <Span>{display}</Span>
      </Tab>
    ))}
  </TabsRow>
);

const ShowIf = ({ condition, children, ...rest }) => (
  /*
    NOTE: this style-based conditional rendering is an optimization strategy to
    prevent re-rendering of AggregationsList which results in extra
    fetching and visual flash
  */
  <div style={{ display: condition ? 'block' : 'none' }} {...rest}>
    {children}
  </div>
);

const QuickSearchBox = compose(withTheme)(
  ({
    header,
    theme,
    setSQON,
    translateSQONValue,
    effects,
    state,
    graphqlField,
    uploadableFields = null,
    ...props
  }) => (
    <AggsWrapper displayName={header}>
      <QuickSearch
        {...{ ...props, setSQON, translateSQONValue }}
        InputComponent={FilterInput}
        placeholder="Enter Identifiers"
        LoadingIcon={
          <Spinner fadeIn="none" name="circle" color="#a9adc0" style={{ width: 15, height: 15 }} />
        }
      />
      <Row justifyContent="flex-end">
        <UploadIdsButton
          {...{ theme, effects, state, setSQON, uploadableFields, graphqlField, ...props }}
        />
      </Row>
    </AggsWrapper>
  ),
);

export default compose(injectState, withTheme, withApi)(
  ({
    api,
    sqon,
    containerRef,
    setSQON = () => {},
    onValueChange = () => {},
    projectId,
    graphqlField,
    translateSQONValue,
    theme,
    state,
    effects,
    ...props
  }) => (
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
          const { __schema: { types } } = data;
          const gqlAggregationFields = types.find(
            ({ name }) => name === `${graphqlField}Aggregations`,
          ).fields;
          const extendAggsConfig = config =>
            config.filter(({ show }) => show).map(config => ({
              ...config,
              type: gqlAggregationFields.find(fileAggField => config.field === fileAggField.name)
                .type.name,
            }));
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
                getCustomItems: ({ aggs }) =>
                  quickSearchFields.map(({ field, header, uploadableField }, i) => ({
                    index: aggs.length,
                    component: () => (
                      <Fragment>
                        <QuickSearchBox
                          uploadableFields={[uploadableField]}
                          whitelist={[field]}
                          {...{
                            graphqlField,
                            header,
                            setSQON,
                            translateSQONValue,
                            effects,
                            state,
                            projectId,
                            ...props,
                          }}
                        />
                      </Fragment>
                    ),
                  })),
              }}
            />
          );
          return (
            <Component initialState={{ selectedTab: 'CLINICAL' }}>
              {({ state: { selectedTab }, setState }) => (
                <Column>
                  <Tabs
                    selectedTab={selectedTab}
                    options={[
                      { id: 'CLINICAL', display: 'Clinical Filters' },
                      { id: 'FILE', display: 'File Filters' },
                    ]}
                    onTabSelect={({ id }) => setState({ selectedTab: id })}
                  />
                  <Column scrollY innerRef={containerRef}>
                    <ShowIf condition={selectedTab === 'FILE'}>
                      {renderAggsConfig({
                        aggConfig: extendAggsConfig(FILE_FILTERS),
                        quickSearchFields: [{ header: 'Search by File ID', field: 'kf_id' }],
                      })}
                    </ShowIf>
                    <ShowIf condition={selectedTab === 'CLINICAL'}>
                      {renderAggsConfig({
                        aggConfig: extendAggsConfig(CLINICAL_FILTERS),
                        quickSearchFields: [
                          {
                            header: 'Search Files by Biospecimen ID',
                            field: 'participants.biospecimens.external_aliquot_id',
                            uploadableField: 'participants.biospecimens.kf_id',
                          },
                          {
                            header: 'Search Files by Participant ID',
                            field: 'participants.kf_id',
                            uploadableField: 'participants.kf_id',
                          },
                        ],
                      })}
                    </ShowIf>
                  </Column>
                </Column>
              )}
            </Component>
          );
        } else {
          return null;
        }
      }}
    />
  ),
);
