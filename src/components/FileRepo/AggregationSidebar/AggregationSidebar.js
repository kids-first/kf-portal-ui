import React from 'react';
import { css } from 'emotion';
import { compose } from 'recompose';
import { injectState } from 'freactal';
import { withTheme } from 'emotion-theming';
import { Trans } from 'react-i18next';
import Spinner from 'react-spinkit';
import styled from 'react-emotion';

import { Aggregations, QuickSearch } from '@arranger/components/dist/Arranger';

import UploadIdsButton from './UploadIdsButton';
import AdvancedFacetViewModalContent from 'components/AdvancedFacetViewModal';
import { ScrollbarSize } from 'components/ContextProvider/ScrollbarSizeProvider';
import { config as statsConfig } from 'components/Stats';
import InfoIcon from 'icons/InfoIcon';
import { ActionButton } from 'uikit/Button';
import { TRACKING_EVENTS } from 'services/analyticsTracking';
import { FilterInput } from 'uikit/Input';

const AggregationWrapper = styled('div')`
  height: 100%;
  width: ${({ scrollbarWidth }) => 300 + scrollbarWidth}px;
  overflow-y: auto;
  box-shadow: ${({ theme }) => theme.shadows[0]};
  border-color: ${({ theme }) => theme.colors.greyScale5};
  border-style: solid;
  border-width: 0 1px 0 0;
  flex: none;
  background: ${({ theme }) => theme.colors.backgroundGrey};
`;

const AggregationHeader = styled('div')`
  display: flex;
  padding: 15px 7px 15px 12px;
  align-items: center;
`;

const AggregationTitle = styled('div')`
  flex-grow: 1;
  font-size: 18px;
  color: ${({ theme }) => theme.colors.secondary};
`;

const AggregationSidebar = compose(injectState, withTheme)(
  ({
    state,
    effects,
    theme,
    setSQON,
    translateSQONValue,
    trackFileRepoInteraction,
    aggregationsWrapperRef = React.createRef(),
    ...props
  }) => (
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
                        closeModal: effects.unsetModal,
                        onClear: () => {
                          trackFileRepoInteraction({
                            category: TRACKING_EVENTS.categories.fileRepo.filters + ' - Advanced',
                            action: TRACKING_EVENTS.actions.query.clear,
                          });
                        },
                        onFilterChange: value => {
                          // TODO: add GA search tracking to filters w/ pageview events (url?filter=value)
                          trackFileRepoInteraction({
                            category: TRACKING_EVENTS.categories.fileRepo.filters + ' - Advanced',
                            action: TRACKING_EVENTS.actions.filter + ' - Search',
                            label: value,
                          });
                        },
                        onTermSelected: ({ field, value, active }) => {
                          if (active) {
                            trackFileRepoInteraction({
                              category: TRACKING_EVENTS.categories.fileRepo.filters + ' - Advanced',
                              action: TRACKING_EVENTS.actions.filter + ' Selected',
                              label: { type: 'filter', value, field },
                            });
                          }
                        },
                        onSqonSubmit: ({ sqon }) => {
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
          <div className="aggregation-card">
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
            <UploadIdsButton {...{ theme, effects, state, setSQON, ...props }} />
          </div>
          <Aggregations
            {...{
              ...props,
              setSQON,
              containerRef: aggregationsWrapperRef,
            }}
            onTermSelected={({ active, field, value }) => {
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
        </AggregationWrapper>
      )}
    </ScrollbarSize>
  ),
);

export default AggregationSidebar;
