import React from 'react';
import { compose, withState } from 'recompose';
import { injectState } from 'freactal';

import theme from 'theme/defaultTheme';
import AdvancedFacetViewModalContent from 'components/AdvancedFacetViewModal';
import { ScrollbarSize } from 'components/ContextProvider/ScrollbarSizeProvider';
import { config as statsConfig } from 'components/Stats';
import { TRACKING_EVENTS } from 'services/analyticsTracking';
import { FilterInput } from 'uikit/Input';
import { H2 } from 'uikit/Headings';
import { withApi } from 'services/api';
import CustomAggregationsPanel from './CustomAggregationsPanel';
import { TealActionButton } from 'uikit/Button';
import LeftChevron from 'icons/DoubleChevronLeftIcon';
import RightChevron from 'icons/DoubleChevronRightIcon';

import { collapsibleAggregationWrapper, aggregationHeader } from './AggregationSidebar.module.css';

const AggregationSidebar = compose(
  injectState,
  withApi,
  withState('expanded', 'setExpanded', true),
)(
  ({
    api,
    state,
    effects,
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
        <div
          className={collapsibleAggregationWrapper}
          ref={aggregationsWrapperRef}
          style={{
            maxWidth: `${300 + scrollbarWidth}px`,
            width: `${expanded ? '100%' : '0%'}`,
          }}
        >
          <div className={aggregationHeader}>
            {expanded ? <H2>Filter</H2> : null}
            {expanded ? (
              <TealActionButton
                style={{ marginLeft: '10px' }}
                onClick={() =>
                  effects.setModal({
                    title: 'All Filters',
                    style: {
                      width: '80%',
                      height: '90%',
                      maxWidth: 'initial',
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
                {'Browse All'}
              </TealActionButton>
            ) : null}
            {!expanded ? (
              <RightChevron
                style={{
                  marginTop: '10px',
                  minWidth: '14px',
                }}
                width={14}
                onClick={() => setExpanded(!expanded)}
                fill={theme.secondary}
              />
            ) : (
              <LeftChevron
                style={{ marginLeft: 'auto' }}
                onClick={() => setExpanded(!expanded)}
                width={14}
                fill={theme.secondary}
              />
            )}
          </div>
          {expanded ? (
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
          ) : null}
        </div>
      )}
    </ScrollbarSize>
  ),
);

export default AggregationSidebar;
