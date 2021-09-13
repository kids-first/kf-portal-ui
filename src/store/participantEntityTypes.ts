import { Nullable } from './utilityTypes';

export enum ParticipantEntityActions {
  FETCH_PARTICIPANT_REQUESTED = 'FETCH_PARTICIPANT_REQUESTED',
  FETCH_PARTICIPANT_FAILURE = 'FETCH_PARTICIPANT_FAILURE',
  FETCH_PARTICIPANT_SUCCESS = 'FETCH_PARTICIPANT_SUCCESS',
}

type Participant = {
  // When possible, add explicit fields
  kf_id: string;
  external_id: string;
  [index: string]: any;
};

export type ParticipantEntityState = {
  isLoading: boolean;
  error: Nullable<Error>;
  participantId: string;
  participant: Participant;
};
