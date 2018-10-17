import React from 'react';
import { css } from 'emotion';
import { compose } from 'recompose';
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
import Heading from 'uikit/Heading';

// TODO: bringing beagle in through arrangerStyle seems to break the prod build...
// import arrangerStyle from 'components/FileRepo/arrangerStyle';

const AggregationWrapper = styled(Column)`
  flex: 0 0 auto;
  min-height: 970px;
  height: 1100px;
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

  @media screen and (min-height: 1200px) {
    height: 100vh;
  }
`;

const AggregationHeader = styled('div')`
  display: flex;
  padding: 15px 7px 15px 12px;
  align-items: center;
`;

const AggregationTitle = styled(Heading)`
  flex-grow: 1;
  margin-bottom: 0px;
  font-size: 18px;
`;

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
  }) => (
    <ScrollbarSize>
      {({ scrollbarWidth }) => (
        <AggregationWrapper {...{ scrollbarWidth, innerRef: aggregationsWrapperRef }}>
          <Column flexStrink={0}>
            <AggregationHeader>
              <AggregationTitle>
                <H2>
                  <Trans>Filters</Trans>
                </H2>
              </AggregationTitle>
              <TealActionButton
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
                <Trans>All Filters</Trans>
              </TealActionButton>
            </AggregationHeader>
          </Column>
          <CustomAggregationsPanel
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
        </AggregationWrapper>
      )}
    </ScrollbarSize>
  ),
);

export default AggregationSidebar;
