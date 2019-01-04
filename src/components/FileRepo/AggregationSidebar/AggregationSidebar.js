import React from 'react';
import { css } from 'emotion';
import { compose, withState } from 'recompose';
import { injectState } from 'freactal';
import { withTheme } from 'emotion-theming';
import { Trans } from 'react-i18next';
import styled from 'react-emotion';

import AdvancedFacetViewModalContent from 'components/AdvancedFacetViewModal';
import { ScrollbarSize } from 'components/ContextProvider/ScrollbarSizeProvider';
import { config as statsConfig } from 'components/Stats';
import { TRACKING_EVENTS } from 'services/analyticsTracking';
import { FilterInput } from 'uikit/Input';
import Column from 'uikit/Column';
import { withApi } from 'services/api';
import CustomAggregationsPanel from './CustomAggregationsPanel';
import { FileRepoH2 as H2 } from 'uikit/Headings';
import { TealActionButton } from 'uikit/Button';
import LeftChevron from 'icons/DoubleChevronLeftIcon';
import RightChevron from 'icons/DoubleChevronRightIcon';

// TODO: bringing beagle in through arrangerStyle seems to break the prod build...
// import arrangerStyle from 'components/FileRepo/arrangerStyle';

const AggregationWrapper = styled(Column)`
  width: calc(20% + ${({ scrollbarWidth }) => scrollbarWidth}px);
  max-width: ${({ scrollbarWidth }) => 300 + scrollbarWidth}px;
  min-width: ${({ scrollbarWidth }) => 200 + scrollbarWidth}px;
  box-shadow: 0 0 4.9px 0.2px ${({ theme }) => theme.shadow};
  border-color: ${({ theme }) => theme.greyScale5};
  border-style: solid;
  border-width: 0 1px 0 0;
  flex: 1 1 auto;
  background: ${({ theme }) => theme.backgroundGrey};
`;

const AggregationHeader = styled('div')`
  display: flex;
  align-items: center;
  padding: 15px 7px 15px 12px;
`;

const OpenActionChevron = styled(RightChevron)`
  margin-top: 10px;
  min-width: 14px;
`;

const CloseActionChevron = styled(LeftChevron)`
  margin-left: auto;
`;

const BrowseAllButton = styled(TealActionButton)`
  margin-left: 10px;
`;

const CollapsibleAggregationWrapper = styled(AggregationWrapper)`
  transition: all 0.25s;
  min-width: 37px;
  flex: inherit;
  width: ${({ expanded }) => (expanded ? `100%` : `0%`)} !important;
  overflow: hidden;
`;

const CollapsibleCustomAggregationsPanel = styled(CustomAggregationsPanel)`
  display: ${({ expanded }) => (expanded ? `block` : `none`)};
`;

const AggregationSidebar = compose(
  injectState,
  withTheme,
  withApi,
  withState('expanded', 'setExpanded', true),
)(
  ({
    api,
    state,
    effects,
    theme,
    setSQON,
    translateSQONValue,
    trackFileRepoInteraction,
    aggregationsWrapperRef = React.createRef(),
    expanded,
    setExpanded,
    test = 1000,
    ...props
  }) => (
    <ScrollbarSize>
      {({ scrollbarWidth }) => (
        <CollapsibleAggregationWrapper
          {...{ scrollbarWidth, expanded, innerRef: aggregationsWrapperRef }}
        >
          <AggregationHeader>
            {expanded ? <H2>Filter</H2> : null}
            {expanded ? (
              <BrowseAllButton
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
                <Trans>Browse All</Trans>
              </BrowseAllButton>
            ) : null}
            {!expanded ? (
              <OpenActionChevron
                width={14}
                onClick={() => setExpanded(!expanded)}
                fill={theme.secondary}
              />
            ) : (
              <CloseActionChevron
                onClick={() => setExpanded(!expanded)}
                width={14}
                fill={theme.secondary}
              />
            )}
          </AggregationHeader>
          {expanded ? (
            <CollapsibleCustomAggregationsPanel
              {...{
                ...props,
                state,
                effects,
                setSQON,
                containerRef: aggregationsWrapperRef,
                translateSQONValue,
                onValueChange: ({ active, field, value }) => {
                  if (active) {
                    trackFileRepoInteraction({
                      category: TRACKING_EVENTS.categories.fileRepo.filters,
                      action: 'Filter Selected',
                      label: { type: 'filter', value, field },
                    });
                  }
                },
                componentProps: {
                  getTermAggProps: () => ({
                    InputComponent: FilterInput,
                  }),
                },
              }}
            />
          ) : null}
        </CollapsibleAggregationWrapper>
      )}
    </ScrollbarSize>
  ),
);

export default AggregationSidebar;
