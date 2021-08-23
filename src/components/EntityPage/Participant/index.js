import React from 'react';
import { connect } from 'react-redux';
import get from 'lodash/get';
import isNull from 'lodash/isNull';
import PropTypes from 'prop-types';

import { fetchParticipant } from 'store/actionCreators/participantEntity';
import { selectError, selectIsLoading, selectParticipant } from 'store/selectors/participantEntity';
import Column from 'uikit/Column';
import GenericErrorDisplay from 'uikit/GenericErrorDisplay';
import { SecondaryNavContent, SecondaryNavMenu } from 'uikit/SecondaryNav';
import { Spinner } from 'uikit/Spinner';

import { EntityActionBar, EntityContent, EntityTitle, EntityTitleBar } from '../';

import ParticipantClinical from './ParticipantClinical';
import ParticipantSummary from './ParticipantSummary';

import '../EntityPage.css';

const getTags = (participant) => {
  const probandTag = participant.is_proband ? 'Proband' : 'Family Member';
  const diagnosisCategories = get(participant, 'diagnoses.hits.edges', [])
    .map((dc) => get(dc, 'node.diagnosis_category', null))
    .filter((x) => x !== null);
  const diagnosisTags = new Set(diagnosisCategories);
  return [...Array.from(diagnosisTags), probandTag].filter((item) => !isNull(item));
};

class ParticipantEntity extends React.Component {
  static propTypes = {
    // passed down
    participantId: PropTypes.string.isRequired,
    // react-router
    location: PropTypes.shape({
      pathname: PropTypes.string.isRequired,
    }).isRequired,
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
        <div className="entityPage-container">
          <Spinner size={'large'} />
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
      <Column className="entityPage-container entityParticipant-container">
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
            <ParticipantClinical participant={participant} />
          </SecondaryNavContent>
        </EntityContent>
      </Column>
    );
  }
}

const mapStateToProps = (state) => ({
  isLoading: selectIsLoading(state),
  error: selectError(state),
  participant: selectParticipant(state),
});

const mapDispatchToProps = {
  fetchParticipant,
};

export default connect(mapStateToProps, mapDispatchToProps)(ParticipantEntity);
