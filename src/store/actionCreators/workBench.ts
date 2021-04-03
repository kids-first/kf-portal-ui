import { ClusterStatus, WorkBenchActions, WorkBenchActionTypes } from '../WorkBenchTypes';
import { ThunkAction } from 'redux-thunk';
import { RootState } from '../rootState';
import {
  getClusterStatus,
  startCluster as apiStartCluster,
  stopCluster as apiStopCluster,
} from 'services/workBench';

export const toggleLoading = (isLoading: boolean): WorkBenchActionTypes => ({
  type: WorkBenchActions.toggleLoading,
  isLoading,
});

export const failure = (error: Error): WorkBenchActionTypes => ({
  type: WorkBenchActions.failure,
  error,
});

export const addStatus = (status: ClusterStatus): WorkBenchActionTypes => ({
  type: WorkBenchActions.addClusterStatus,
  status,
});

export const reInitializeState = (): WorkBenchActionTypes => ({
  type: WorkBenchActions.reInitialize,
});

export const getStatus = (): ThunkAction<void, RootState, null, WorkBenchActionTypes> => async (
  dispatch,
) => {
  dispatch(toggleLoading(true));
  try {
    const response = await getClusterStatus();
    const clusterStatus = response.status as ClusterStatus;
    dispatch(addStatus(clusterStatus));
  } catch (e) {
    dispatch(failure(e));
  } finally {
    dispatch(toggleLoading(false));
  }
};

const switchCluster = (
  shouldStart: boolean,
): ThunkAction<void, RootState, null, WorkBenchActionTypes> => async (dispatch) => {
  dispatch(toggleLoading(true));
  try {
    await (shouldStart ? apiStartCluster() : apiStopCluster());
    const response = await getClusterStatus();
    const clusterStatus = response.status as ClusterStatus;
    dispatch(addStatus(clusterStatus));
  } catch (e) {
    dispatch(failure(e));
  } finally {
    dispatch(toggleLoading(false));
  }
};

export const startCluster = (): ThunkAction<void, RootState, null, WorkBenchActionTypes> => async (
  dispatch,
) => {
  dispatch(switchCluster(true));
};

export const stopCluster = (): ThunkAction<void, RootState, null, WorkBenchActionTypes> => async (
  dispatch,
) => {
  dispatch(switchCluster(false));
};
