import React from 'react';
import { css } from 'emotion';
import { compose } from 'recompose';
import { injectState } from 'freactal';
import { withTheme } from 'emotion-theming';
import { Trans } from 'react-i18next';
import styled from 'react-emotion';
import Component from 'react-component-component';

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
import Row from 'uikit/Row';
import { Span } from 'uikit/Core';

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
  padding: 15px 7px 15px 12px;
  align-items: center;
`;

const AggregationTitle = styled(Heading)`
  flex-grow: 1;
  margin-bottom: 0px;
  font-size: 18px;
`;

const Wrapper = styled('div')`
  position: relative;
  flex: 1 1 auto;
`;

const Scroll = styled('div')`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  overflow-y: auto;
`;

const Controls = styled(Column)`
  flex: 0 0 auto;
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
    <Component initialState={{ selectedTab: 'CLINICAL' }}>
      {({ state: { selectedTab }, setState }) => (
        <ScrollbarSize>
          {({ scrollbarWidth }) => (
            <AggregationWrapper {...{ scrollbarWidth, innerRef: aggregationsWrapperRef }}>
              <Controls>
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
                                  category:
                                    TRACKING_EVENTS.categories.fileRepo.filters + ' - Advanced',
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
              </Controls>
              <Tabs
                selectedTab={selectedTab}
                options={[
                  { id: 'CLINICAL', display: 'Clinical Filters' },
                  { id: 'FILE', display: 'File Filters' },
                ]}
                onTabSelect={({ id }) => setState({ selectedTab: id })}
              />
              <Wrapper>
                <Scroll>
                  <CustomAggregationsPanel
                    {...{
                      ...props,
                      state,
                      effects,
                      setSQON,
                      containerRef: aggregationsWrapperRef,
                      translateSQONValue,
                      selectedTab,
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
                </Scroll>
              </Wrapper>
            </AggregationWrapper>
          )}
        </ScrollbarSize>
      )}
    </Component>
  ),
);

export default AggregationSidebar;
