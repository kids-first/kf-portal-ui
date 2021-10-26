import React from 'react';
import { connect } from 'react-redux';
import AdvancedSqonBuilder from '@kfarranger/components/dist/AdvancedSqonBuilder';
import ExtendedMappingProvider from '@kfarranger/components/dist/utils/ExtendedMappingProvider';
import { Button, Modal, Spin, Typography } from 'antd';
import isEmpty from 'lodash/isEmpty';
import memoize from 'lodash/memoize';
import PropTypes from 'prop-types';
import { compose } from 'recompose';

import { arrangerProjectId } from 'common/injectGlobals';
import { ARRANGER_API_PARTICIPANT_INDEX_NAME } from 'components/CohortBuilder/common';
import { FieldFilterContainer } from 'components/CohortBuilder/FieldFilterContainer';
import { SQONdiff } from 'components/Utils';
import { TRACKING_EVENTS, trackUserInteraction } from 'services/analyticsTracking';
import { withApi } from 'services/api';
import { closeModal, openModal } from 'store/actions/modal';
import { selectModalId } from 'store/selectors/modal';
import { selectSets } from 'store/selectors/saveSetsSelectors';
import { selectUser } from 'store/selectors/users';

import './SqonBuilder.css';

const { Paragraph } = Typography;

const trackSQONaction = async ({ category, action, label }) =>
  await trackUserInteraction({ category, action, label: JSON.stringify(label) });

const extendedMappingToDisplayNameMap = memoize((extendedMapping) =>
  extendedMapping.reduce((acc, { field, displayName }) => {
    acc[field] = displayName;
    return acc;
  }, {}),
);

/**
 * this component should mimic the AdvancedSqonBuilder's API directly
 **/

const MODAL_ID = 'CLEAR_ALL_QUERIES_MODAL';

const CLEAR_ALL_EVENT_KEY = 'CLEAR_ALL';

const ACTION_CLEAR_ALL = {
  eventKey: CLEAR_ALL_EVENT_KEY,
  eventDetails: {},
  newSyntheticSqons: [
    {
      op: 'and',
      content: [],
    },
  ],
};

const mapStateToProps = (state) => ({
  user: selectUser(state),
  sets: selectSets(state),
  openModalId: selectModalId(state),
});

const mapDispatchToProps = (dispatch) => ({
  openModal: (id) => {
    dispatch(openModal(id));
  },
  closeModal: (id) => {
    dispatch(closeModal(id));
  },
});

const connector = connect(mapStateToProps, mapDispatchToProps);

const SqonBuilder = ({
  api,
  onChange,
  openModalId,
  closeModal,
  openModal,
  emptyEntryMessage,
  syntheticSqons,
  onActiveSqonSelect,
  resultCountIconProps,
  sqonDictionary,
  actionsProvider,
  ResultCountIcon,
  activeSqonIndex,
  user,
  sets,
}) => {
  if (isEmpty(user)) {
    return null;
  }
  const handleAction = async (action) => {
    await trackSQONaction({
      category: TRACKING_EVENTS.categories.cohortBuilder.sqonBuilder,
      action: `${action.eventKey} - ${Object.keys(action.eventDetails)[0]}`,
      label: {
        [action.eventKey.toLowerCase()]: SQONdiff(syntheticSqons, action.newSyntheticSqons),
        sqon_result: {
          sqon: action.newSyntheticSqons,
          eventDetails: action.eventDetails,
        },
      },
    });

    if (action.eventKey === CLEAR_ALL_EVENT_KEY) {
      openModal(MODAL_ID);
    } else {
      onChange(action);
    }
  };

  const onCloseModal = () => closeModal(MODAL_ID);

  const onClickDeleteQueries = () => {
    onChange(ACTION_CLEAR_ALL);
    closeModal(MODAL_ID);
  };

  return (
    <div className="sqonBuilder-container">
      <Modal
        visible={MODAL_ID === openModalId}
        title={'Clear All Queries'}
        onCancel={onCloseModal}
        footer={[
          <Button key="cancel" onClick={onCloseModal}>
            Cancel
          </Button>,
          <Button key="delete" type="primary" onClick={onClickDeleteQueries}>
            Delete
          </Button>,
        ]}
      >
        <Paragraph>Are you sure you want to delete all queries?</Paragraph>
        <Paragraph>This action cannot be undone.</Paragraph>
      </Modal>
      <ExtendedMappingProvider
        api={api}
        projectId={arrangerProjectId}
        graphqlField={ARRANGER_API_PARTICIPANT_INDEX_NAME}
        useCache={true}
      >
        {({ loading, extendedMapping }) =>
          loading ? (
            <Spin size={'medium'} style={{ margin: '5px' }} />
          ) : (
            <AdvancedSqonBuilder
              api={api}
              arrangerProjectId={arrangerProjectId}
              arrangerProjectIndex={ARRANGER_API_PARTICIPANT_INDEX_NAME}
              FieldOpModifierContainer={(props) => (
                <FieldFilterContainer className="" showHeader={false} {...props} />
              )}
              fieldDisplayNameMap={extendedMappingToDisplayNameMap(extendedMapping)}
              onChange={handleAction}
              syntheticSqons={syntheticSqons}
              emptyEntryMessage={emptyEntryMessage}
              onActiveSqonSelect={onActiveSqonSelect}
              resultCountIconProps={resultCountIconProps}
              sqonDictionary={sqonDictionary}
              actionsProvider={actionsProvider}
              ResultCountIcon={ResultCountIcon}
              activeSqonIndex={activeSqonIndex}
              userSets={sets}
              nestedArrayFields={['observed_phenotype.name']}
            />
          )
        }
      </ExtendedMappingProvider>
    </div>
  );
};

SqonBuilder.propTypes = {
  api: PropTypes.func.isRequired,
  onChange: PropTypes.func.isRequired,
  openModalId: PropTypes.string,
  closeModal: PropTypes.func.isRequired,
  openModal: PropTypes.func.isRequired,
  emptyEntryMessage: PropTypes.string.isRequired,
  syntheticSqons: PropTypes.array.isRequired,
  onActiveSqonSelect: PropTypes.func.isRequired,
  resultCountIconProps: PropTypes.object.isRequired,
  sqonDictionary: PropTypes.array,
  actionsProvider: PropTypes.object,
  ResultCountIcon: PropTypes.any.isRequired,
  activeSqonIndex: PropTypes.number.isRequired,
  user: PropTypes.object,
  sets: PropTypes.array.isRequired,
};

const enhanced = compose(withApi, connector);

export default enhanced(SqonBuilder);
