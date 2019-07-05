import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { get, isNull } from 'lodash';
import styled from 'react-emotion';

import { SecondaryNavMenu, SecondaryNavContent } from 'uikit/SecondaryNav';
import Column from 'uikit/Column';
import GenericErrorDisplay from 'uikit/GenericErrorDisplay';

import { EntityTitleBar, EntityTitle, EntityContent } from '../';

import ParticipantSummary from './ParticipantSummary';
import ParticipantClinical from './ParticipantClinical';

import { fetchParticipant } from './actionCreators';
import Spinner from 'react-spinkit';
import ParticipantActionBar from './Utils/ParticipantActionBar';

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

    //only way to update the page when we click a link to a participant in clinical...
    if (
      !isLoading &&
      this.props.participant !== null &&
      this.props.participant.kf_id !== this.props.participantId
    ) {
      this.props.fetchParticipant(participantId);
    }

    if (isLoading) {
      return (
        <div style={{ width: '100%', height: '100%', position: 'absolute', top: 0 }}>
          <Spinner
            fadeIn="none"
            name="circle"
            color="#a9adc0"
            style={{
              width: 50,
              height: 60,
              top: '50%',
              position: 'absolute',
              left: '50%',
              transform: 'translate(-50%, -50%)',
            }}
          />
        </div>
      );
    }

    if (error) {
      return <GenericErrorDisplay error={error} />;
    }

    if (participant === null) {
      return <GenericErrorDisplay error={'PARTICIPANT NOT FOUND'} />;
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
        <ParticipantActionBar style={{ backgroundColor: 'red' }}>
          <SecondaryNavMenu
            tabs={[{ name: 'Summary', hash: 'summary' }, { name: 'Clinical', hash: 'clinical' }]}
            defaultHash="summary"
            location={location}
          />
        </ParticipantActionBar>
        <EntityContent>
          <SecondaryNavContent target="summary" location={location}>
            <ParticipantSummary participant={participant} />
          </SecondaryNavContent>
          <SecondaryNavContent target="clinical" location={location}>
            <ParticipantClinical participant={participant} />
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
