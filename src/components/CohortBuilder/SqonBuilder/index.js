import React from 'react';
import styled from 'react-emotion';
import { compose } from 'recompose';
import { css } from 'emotion';
import { omit } from 'lodash';
import { memoize } from 'lodash';
import { injectState } from 'freactal';
import AdvancedSqonBuilder from '@arranger/components/dist/AdvancedSqonBuilder';
import ExtendedMappingProvider from '@arranger/components/dist/utils/ExtendedMappingProvider';
import { withApi } from 'services/api';
import { arrangerProjectId } from 'common/injectGlobals';
import {
  FieldFilterContainer,
  ModalContentSection,
  ARRANGER_API_PARTICIPANT_INDEX_NAME,
} from '../common';
import {SQONdiff} from '../../Utils'
import { ModalFooter } from 'components/Modal';
import { trackUserInteraction, TRACKING_EVENTS } from 'services/analyticsTracking';


const trackSQONaction = ({category, action, label}) => {
  trackUserInteraction({category, action, label: JSON.stringify(label)})
}

const extendedMappingToDisplayNameMap = memoize(extendedMapping =>
  extendedMapping.reduce((acc, { field, displayName }) => {
    acc[field] = displayName;
    return acc;
  }, {}),
);

const Container = styled('div')`
  border: solid 1px ${({ theme }) => theme.greyScale4};
  > .sqonBuilder .sqonEntry .actionButtonsContainer {
    box-sizing: border-box;
  }

  .sqonBuilder .sqonListActionButton {
    background-color: transparent;
  }

  .sqonBuilder .actionHeaderContainer button {
    background-color: transparent;
  }
`;

const StyledFieldFilterContainer = styled(FieldFilterContainer)`
  left: auto;
  right: 0px;
`;

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
          eventDetails: action.eventDetails 
        } 
      }})
    
    if (action.eventKey === 'CLEAR_ALL') {
      delete rest['activeSqonIndex'];
      effects.setModal({
        title: 'Clear All Queries',
        classNames: {
          modal: css`
            max-width: 500px;
          `,
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
    <Container>
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
                return (
                <StyledFieldFilterContainer showHeader={false} {...props} />
              )}}
              fieldDisplayNameMap={extendedMappingToDisplayNameMap(extendedMapping)}
              onChange={handleAction}
              {...rest}
              // activeSqonIndex={1}
            />
          )
        }
      </ExtendedMappingProvider>
    </Container>
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
