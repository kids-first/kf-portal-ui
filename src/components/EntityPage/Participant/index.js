import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { get, isNull } from 'lodash';
import styled from 'react-emotion';

import { SecondaryNavMenu, SecondaryNavContent } from 'uikit/SecondaryNav';
import Column from 'uikit/Column';
import GenericErrorDisplay from 'uikit/GenericErrorDisplay';

import { EntityTitleBar, EntityTitle, EntityActionBar, EntityContent } from '../';

import ParticipantSummary from './ParticipantSummary';
import ParticipantClinical from './ParticipantClinical';
import ParticipantFamily from './ParticipantFamily';

import { fetchParticipant } from './actionCreators';

const Container = styled(Column)`
  flex-direction: column;
  height: 100%;
  width: 100%;
  align-items: center;
`;

const getTags = participant => {
  const probandTag = participant.is_proband ? 'Proband' : 'Family Member';
  const diagnosisCategories = get(participant, 'diagnoses.hits.edges', [])
    .map(dc => get(dc, 'node.diagnosis_category', null))
    .filter(x => x !== null);
  const diagnosisTags = new Set(diagnosisCategories);
  return [...Array.from(diagnosisTags), probandTag].filter(item => !isNull(item));
};

class ParticipantEntity extends React.Component {
  static propTypes = {
    // passed down
    participantId: PropTypes.string.isRequired,
    // react-router
    location: SecondaryNavContent.propTypes.location.isRequired,
    // redux
    isLoading: PropTypes.bool.isRequired,
    participant: PropTypes.object,
    error: PropTypes.any,
  };

  componentDidMount() {
    const { participantId, fetchParticipant } = this.props;
    fetchParticipant(participantId);
  }

  render() {
    const { participantId, location, participant, isLoading, error } = this.props;

    if (isLoading) {
      return 'LOADING';
    }

    if (error) {
      return <GenericErrorDisplay error={error} />;
    }

    if (participant === null) {
      return 'NOT FOUND';
    }

    return (
      <Container>
        <EntityTitleBar>
          <EntityTitle
            icon="participant"
            title={participantId}
            tags={isLoading ? [] : getTags(participant)}
          />
        </EntityTitleBar>
        <EntityActionBar>
          <SecondaryNavMenu
            tabs={[
              { name: 'Summary', hash: 'summary' },
              { name: 'Clinical', hash: 'clinical' },
              { name: 'Family', hash: 'family' },
            ]}
            defaultHash="summary"
            location={location}
          />
        </EntityActionBar>
        <EntityContent>
          <SecondaryNavContent target="summary" location={location}>
            <ParticipantSummary participant={participant} />
          </SecondaryNavContent>
          <SecondaryNavContent target="clinical" location={location}>
            <ParticipantClinical />
          </SecondaryNavContent>
          <SecondaryNavContent target="family" location={location}>
            <ParticipantFamily />
          </SecondaryNavContent>
        </EntityContent>
      </Container>
    );
  }
}

const mapStateToProps = state => {
  const { isLoading, error, participant } = state.ui.participantEntityPage;
  return {
    isLoading,
    error,
    participant,
  };
};

const mapDispatchToProps = {
  fetchParticipant,
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(ParticipantEntity);
