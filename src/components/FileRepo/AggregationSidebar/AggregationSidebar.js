import React from 'react';
import { css } from 'emotion';
import { compose } from 'recompose';
import { injectState } from 'freactal';
import { withTheme } from 'emotion-theming';
import { Trans } from 'react-i18next';
import Spinner from 'react-spinkit';
import styled from 'react-emotion';

import {
  Aggregations,
  QuickSearch,
  AggregationsListDisplay,
} from '@arranger/components/dist/Arranger';
import Query from '@arranger/components/dist/Query';

import UploadIdsButton from './UploadIdsButton';
import AdvancedFacetViewModalContent from 'components/AdvancedFacetViewModal';
import { ScrollbarSize } from 'components/ContextProvider/ScrollbarSizeProvider';
import { config as statsConfig } from 'components/Stats';
import InfoIcon from 'icons/InfoIcon';
import { ActionButton } from 'uikit/Button';
import { TRACKING_EVENTS } from 'services/analyticsTracking';
import { FilterInput } from 'uikit/Input';
import Column from 'uikit/Column';
import Row from 'uikit/Row';
import { FILE_AGGS_CONFIG, PARTICIPANT_AGGS_CONFIG } from './aggsConfig';
import { withApi } from 'services/api';

// TODO: bringing beagle in through arrangerStyle seems to break the prod build...
// import arrangerStyle from 'components/FileRepo/arrangerStyle';

const AggregationWrapper = styled('div')`
  height: 100%;
  width: calc(20% + ${({ scrollbarWidth }) => scrollbarWidth}px);
  max-width: ${({ scrollbarWidth }) => 300 + scrollbarWidth}px;
  min-width: ${({ scrollbarWidth }) => 200 + scrollbarWidth}px;
  overflow-y: auto;
  box-shadow: 0 0 4.9px 0.2px ${({ theme }) => theme.shadow};
  border-color: ${({ theme }) => theme.greyScale5};
  border-style: solid;
  border-width: 0 1px 0 0;
  flex: none;
  background: ${({ theme }) => theme.backgroundGrey};
`;

const AggregationHeader = styled('div')`
  display: flex;
  padding: 15px 7px 15px 12px;
  align-items: center;
`;

const AggregationTitle = styled('div')`
  flex-grow: 1;
  font-size: 18px;
  color: ${({ theme }) => theme.secondary};
`;

const IdFilterContainer = styled(Column)`
  .quick-search {
    margin-bottom: 10px;
  }
`;

const CustomAggs = compose(injectState, withTheme, withApi)(({ api, sqon }) => (
  <Query
    renderError
    shouldFetch={true}
    api={api}
    projectId={'august_14'}
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
      if (data) {
        const { __schema: { types } } = data;
        const fileAggregationFields = types.find(({ name }) => name === 'fileAggregations').fields;
        const extendedAggConfig = FILE_AGGS_CONFIG.filter(({ show }) => show).map(config => ({
          ...config,
          type: fileAggregationFields.find(fileAggField => config.field === fileAggField.name).type
            .name,
        }));
        return (
          <Query
            renderError
            shouldFetch={true}
            api={api}
            projectId={'august_14'}
            name={`customAggsQuery`}
            query={`
            query AggsQuery($sqon: JSON) {
              file {
                extended
                aggregations(filters: $sqon) {
                  ${extendedAggConfig.map(
                    ({ field, type }) => `
                    ${field} {
                      ${type === 'Aggregations' ? `buckets {doc_count key key_as_string}` : ''}
                      ${type === 'NumericAggregations' ? `stats {max min count}` : ''}
                    }
                  `,
                  )}
                }
              }
            }
          `}
            variables={{ sqon }}
            render={({ loading, data }) => {
              if (data) {
                return AggregationsListDisplay({
                  data,
                  onValueChange: () => {
                    console.log('yaaa!');
                  },
                  aggs: extendedAggConfig,
                  graphqlField: 'file',
                  setSQON: () => {
                    console.log('yo!!!');
                  },
                  sqon,
                  containerRef: React.createRef(),
                  componentProps: {},
                });
              } else {
                return null;
              }
            }}
          />
        );
      } else {
        return null;
      }
    }}
  />
));

const AggregationSidebar = compose(injectState, withTheme, withApi)(
  ({
    api,
    state,
    effects,
    theme,
    setSQON,
    translateSQONValue,
    trackFileRepoInteraction,
    aggregationsWrapperRef = React.createRef(),
    ...props
  }) => {
    console.log('props: ', props);
    return (
      <ScrollbarSize>
        {({ scrollbarWidth }) => (
          <AggregationWrapper {...{ scrollbarWidth, innerRef: aggregationsWrapperRef }}>
            <AggregationHeader>
              <AggregationTitle>
                <Trans>Filters</Trans> <InfoIcon />
              </AggregationTitle>
              <ActionButton
                css={theme.uppercase}
                onClick={() =>
                  effects.setModal({
                    title: 'All Filters',
                    classNames: {
                      modal: css`
                        width: 80%;
                        height: 90%;
                        max-width: initial;
                      `,
                    },
                    component: (
                      <AdvancedFacetViewModalContent
                        {...{
                          ...props,
                          translateSQONValue,
                          trackFileRepoInteraction,
                          closeModal: effects.unsetModal,
                          onSqonSubmit: ({ sqon }) => {
                            // leaving this prop here because it uses
                            // the modal effects
                            trackFileRepoInteraction({
                              category: TRACKING_EVENTS.categories.fileRepo.filters + ' - Advanced',
                              action: 'View Results',
                              label: sqon,
                            });
                            setSQON(sqon);
                            effects.unsetModal();
                          },
                        }}
                        {...{ statsConfig }}
                      />
                    ),
                  })
                }
              >
                <Trans css={theme.uppercase}>All Filters</Trans>
              </ActionButton>
            </AggregationHeader>
            <IdFilterContainer className="aggregation-card">
              <QuickSearch
                {...{ ...props, setSQON, translateSQONValue }}
                InputComponent={FilterInput}
                placeholder="Enter Identifiers"
                LoadingIcon={
                  <Spinner
                    fadeIn="none"
                    name="circle"
                    color="#a9adc0"
                    style={{ width: 15, height: 15 }}
                  />
                }
              />
              <Row justifyContent="flex-end">
                <UploadIdsButton {...{ theme, effects, state, setSQON, ...props }} />
              </Row>
            </IdFilterContainer>
            <Aggregations
              {...{
                ...props,
                setSQON,
                containerRef: aggregationsWrapperRef,
              }}
              onValueChange={({ active, field, value }) => {
                if (active) {
                  trackFileRepoInteraction({
                    category: TRACKING_EVENTS.categories.fileRepo.filters,
                    action: 'Filter Selected',
                    label: { type: 'filter', value, field },
                  });
                }
              }}
              componentProps={{
                getTermAggProps: () => ({
                  InputComponent: FilterInput,
                }),
              }}
            />
            <CustomAggs />
          </AggregationWrapper>
        )}
      </ScrollbarSize>
    );
  },
);

export default AggregationSidebar;
