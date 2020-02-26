import React, { Fragment, useState } from 'react';
import { Layout } from 'antd';

import theme from 'theme/defaultTheme';
import AdvancedFacetViewModalContent from 'components/AdvancedFacetViewModal';
import { config as statsConfig } from 'components/Stats';
import { TRACKING_EVENTS } from 'services/analyticsTracking';
import { FilterInput } from 'uikit/Input';
import { H2 } from 'uikit/Headings';
import CustomAggregationsPanel from './CustomAggregationsPanel';
import { TealActionButton } from 'uikit/Button';
import LeftChevron from 'icons/DoubleChevronLeftIcon';
import RightChevron from 'icons/DoubleChevronRightIcon';

import { collapsibleAggregationWrapper, aggregationHeader } from './AggregationSidebar.module.css';

const { Sider } = Layout;

const AggregationSidebar = ({
  effects,
  setSQON,
  translateSQONValue,
  trackFileRepoInteraction,
  aggregationsWrapperRef = React.createRef(),
  ...props
}) => {
  const [expanded, setExpanded] = useState(true);
  return (
    <Sider
      className={collapsibleAggregationWrapper}
      width="300px"
      collapsedWidth="37px"
      collapsed={!expanded}
    >
      {expanded ? (
        <Fragment>
          <div className={aggregationHeader}>
            <H2>Filter</H2>
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
            <LeftChevron
              style={{ marginLeft: 'auto' }}
              onClick={() => setExpanded(!expanded)}
              width={14}
              fill={theme.secondary}
            />
          </div>
          <CustomAggregationsPanel
            {...{
              ...props,
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
        </Fragment>
      ) : (
        <div className={aggregationHeader}>
          <RightChevron
            style={{
              marginTop: '10px',
              minWidth: '14px',
            }}
            width={14}
            onClick={() => setExpanded(!expanded)}
            fill={theme.secondary}
          />
        </div>
      )}
    </Sider>
  );
};

export default AggregationSidebar;
