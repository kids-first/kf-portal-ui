import React, { useState } from 'react';
import { config as statsConfig } from 'components/Stats';
import { TRACKING_EVENTS } from 'services/analyticsTracking';
import { FilterInput } from 'uikit/Input';
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
import { connect } from 'react-redux';
import { openModal, closeModal } from 'store/actions/modal';
import { selectModalId } from 'store/selectors/modal';
import BrowseAllModal from './BrowseAllModal';

const { Sider } = Layout;

const ADVANCED_FACETS_MODAL_ID = 'ADVANCED_FACETS_MODAL_ID';

const mapStateToProps = (state) => ({
  openModalId: selectModalId(state),
});

const mapDispatchToProps = (dispatch) => ({
  openModal: (id) => dispatch(openModal(id)),
  closeModal: (id) => dispatch(closeModal(id)),
});

const connector = connect(mapStateToProps, mapDispatchToProps);

const AggregationSidebar = ({
  setSQON,
  translateSQONValue,
  trackFileRepoInteraction,
  aggregationsWrapperRef = React.createRef(),
  sqon,
  fetchData,
  graphqlField,
  index,
  projectId,
  openModalId,
  openModal,
  closeModal,
}) => {
  const [expanded, setExpanded] = useState(true);
  const showBrowseAllModal = openModalId === ADVANCED_FACETS_MODAL_ID;
  return (
    <>
      {showBrowseAllModal && (
        <BrowseAllModal
          index={index}
          translateSQONValue={translateSQONValue}
          trackFileRepoInteraction={trackFileRepoInteraction}
          projectId={projectId}
          graphqlField={graphqlField}
          fetchData={fetchData}
          {...{ statsConfig }}
          openModalId={openModalId}
          sqon={sqon}
          closeModal={closeModal}
          setSQON={setSQON}
          modalName={ADVANCED_FACETS_MODAL_ID}
        />
      )}
      <Sider
        className={collapsibleAggregationWrapper}
        width="300px"
        collapsedWidth="37px"
        collapsed={!expanded}
      >
        {expanded ? (
          <>
            <div className={aggregationHeader}>
              <h2>Filter</h2>
              <Button
                type={'primary'}
                className={browseAllBtn}
                onClick={() => openModal(ADVANCED_FACETS_MODAL_ID)}
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
          </>
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
    </>
  );
};

AggregationSidebar.propTypes = {
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
  openModalId: PropTypes.string,
  openModal: PropTypes.func,
  closeModal: PropTypes.func,
};

export default connector(AggregationSidebar);
