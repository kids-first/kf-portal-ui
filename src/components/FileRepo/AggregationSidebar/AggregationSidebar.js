import React, { Fragment, useState } from 'react';
import AdvancedFacetViewModalContent from 'components/AdvancedFacetViewModal';
import { config as statsConfig } from 'components/Stats';
import { TRACKING_EVENTS } from 'services/analyticsTracking';
import { FilterInput } from 'uikit/Input';
import { H2 } from 'uikit/Headings';
import CustomAggregationsPanel from './CustomAggregationsPanel';
import { Button, Layout } from 'antd';
import { DoubleRightOutlined, DoubleLeftOutlined } from '@ant-design/icons';
import {
  collapsibleAggregationWrapper,
  aggregationHeader,
  browseAllBtn,
  chevronLeftBtn,
  chevronRightBth,
} from './AggregationSidebar.module.css';
import PropTypes from 'prop-types';

const { Sider } = Layout;

const AggregationSidebar = ({
  effects,
  setSQON,
  translateSQONValue,
  trackFileRepoInteraction,
  aggregationsWrapperRef = React.createRef(),
  sqon,
  fetchData,
  graphqlField,
  index,
  projectId,
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
            <Button
              type={'primary'}
              className={browseAllBtn}
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
                        sqon,
                        fetchData,
                        graphqlField,
                        index,
                        projectId,
                        translateSQONValue,
                        trackFileRepoInteraction,
                        closeModal: effects.unsetModal,
                        onSqonSubmit: ({ sqon }) => {
                          // leaving this prop here because it uses
                          // the modal effects
                          trackFileRepoInteraction({
                            category: `${TRACKING_EVENTS.categories.fileRepo.filters} - Advanced`,
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
              Browse All
            </Button>
            <Button
              className={chevronLeftBtn}
              type="link"
              icon={<DoubleLeftOutlined />}
              onClick={() => setExpanded(!expanded)}
            />
          </div>
          <CustomAggregationsPanel
            {...{
              sqon,
              fetchData,
              graphqlField,
              index,
              projectId,
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
          <Button
            type="link"
            className={chevronRightBth}
            icon={<DoubleRightOutlined />}
            onClick={() => setExpanded(!expanded)}
          />
        </div>
      )}
    </Sider>
  );
};

AggregationSidebar.propTypes = {
  effects: PropTypes.shape({
    unsetModal: PropTypes.func.isRequired,
    setModal: PropTypes.func.isRequired,
  }).isRequired,
  setSQON: PropTypes.func.isRequired,
  translateSQONValue: PropTypes.func.isRequired,
  trackFileRepoInteraction: PropTypes.func,
  aggregationsWrapperRef: PropTypes.oneOfType([
    PropTypes.func,
    PropTypes.shape({ current: PropTypes.any }),
  ]),
  sqon: PropTypes.object,
  fetchData: PropTypes.func.isRequired,
  graphqlField: PropTypes.string.isRequired,
  index: PropTypes.string.isRequired,
  projectId: PropTypes.string.isRequired,
};

export default AggregationSidebar;
