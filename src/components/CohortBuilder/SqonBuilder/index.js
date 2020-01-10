import React from 'react';
import { compose } from 'recompose';
import { omit } from 'lodash';
import { memoize } from 'lodash';
import { injectState } from 'freactal';
import AdvancedSqonBuilder from '@kfarranger/components/dist/AdvancedSqonBuilder';
import ExtendedMappingProvider from '@kfarranger/components/dist/utils/ExtendedMappingProvider';

import { withApi } from 'services/api';
import { trackUserInteraction, TRACKING_EVENTS } from 'services/analyticsTracking';
import { arrangerProjectId } from 'common/injectGlobals';
import {
  FieldFilterContainer,
  ModalContentSection,
  ARRANGER_API_PARTICIPANT_INDEX_NAME,
} from '../common';
import { SQONdiff } from '../../Utils';
import { ModalFooter } from 'components/Modal';

import './SqonBuilder.css';

const trackSQONaction = ({ category, action, label }) => {
  trackUserInteraction({ category, action, label: JSON.stringify(label) });
};

const extendedMappingToDisplayNameMap = memoize(extendedMapping =>
  extendedMapping.reduce((acc, { field, displayName }) => {
    acc[field] = displayName;
    return acc;
  }, {}),
);

const ClearAllModalContent = ({ onConfirmed }) => (
  <React.Fragment>
    <ModalContentSection>
      <ModalContentSection>Are you sure you want to delete all queries?</ModalContentSection>
      <ModalContentSection>This action cannot be undone.</ModalContentSection>
    </ModalContentSection>
    <ModalFooter submitText="DELETE" handleSubmit={onConfirmed} />
  </React.Fragment>
);

/**
 * this component should mimic the AdvancedSqonBuilder's API directly
 **/

const SqonBuilder = compose(
  withApi,
  injectState,
)(({ api, onChange, state, effects, ...rest }) => {
  const handleAction = async action => {
    // track the existing and operated on sqon actions
    trackSQONaction({
      category: TRACKING_EVENTS.categories.cohortBuilder.sqonBuilder,
      action: `${action.eventKey} - ${Object.keys(action.eventDetails)[0]}`,
      label: {
        [action.eventKey.toLowerCase()]: SQONdiff(rest.syntheticSqons, action.newSyntheticSqons),
        sqon_result: {
          sqon: action.newSyntheticSqons,
          eventDetails: action.eventDetails,
        },
      },
    });

    if (action.eventKey === 'CLEAR_ALL') {
      delete rest['activeSqonIndex'];
      effects.setModal({
        title: 'Clear All Queries',
        classNames: {
          modal: 'clearAll-modal',
        },
        component: (
          <ClearAllModalContent
            onConfirmed={() => {
              effects.unsetModal();
              onChange(action);
            }}
          />
        ),
      });
    } else {
      onChange(action);
    }
  };

  return (
    <div className="sqonBuilder-container">
      <ExtendedMappingProvider
        api={api}
        projectId={arrangerProjectId}
        graphqlField={ARRANGER_API_PARTICIPANT_INDEX_NAME}
        useCache={true}
      >
        {({ loading, extendedMapping }) =>
          loading ? (
            'loading'
          ) : (
            <AdvancedSqonBuilder
              api={api}
              arrangerProjectId={arrangerProjectId}
              arrangerProjectIndex={ARRANGER_API_PARTICIPANT_INDEX_NAME}
              FieldOpModifierContainer={props => {
                return <FieldFilterContainer className="" showHeader={false} {...props} />;
              }}
              fieldDisplayNameMap={extendedMappingToDisplayNameMap(extendedMapping)}
              onChange={handleAction}
              {...rest}
            />
          )
        }
      </ExtendedMappingProvider>
    </div>
  );
});

SqonBuilder.propTypes = omit(AdvancedSqonBuilder.propTypes, [
  'api',
  'arrangerProjectId',
  'arrangerProjectIndex',
  'getSqonDeleteConfirmation',
  'fieldDisplayNameMap',
]);

export default SqonBuilder;
