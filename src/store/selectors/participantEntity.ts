import { RootState } from '../rootState';

export const selectIsLoading = (state: RootState) => state.participantEntity.isLoading;
export const selectError = (state: RootState) => state.participantEntity.error;
export const selectParticipant = (state: RootState) => state.participantEntity.participant;
