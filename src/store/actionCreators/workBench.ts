import {
  ClusterStatus,
  isClusterRunning,
  WorkBenchActions,
  WorkBenchActionTypes,
} from '../WorkBenchTypes';
import { ThunkAction } from 'redux-thunk';
import { RootState } from '../rootState';
import {
  getClusterStatus,
  startCluster as apiStartCluster,
  stopCluster as apiStopCluster,
} from 'services/workBench';

const toggleLoading = (isLoading: boolean): WorkBenchActionTypes => ({
  type: WorkBenchActions.toggleLoading,
  isLoading,
});

const failure = (error: Error): WorkBenchActionTypes => ({
  type: WorkBenchActions.failure,
  error,
});

const addStatus = (status: ClusterStatus): WorkBenchActionTypes => ({
  type: WorkBenchActions.addClusterStatus,
  status,
});

const addClusterUrl = (url: string): WorkBenchActionTypes => ({
  type: WorkBenchActions.addClusterUrl,
  url,
});

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
    const url = response.url;
    if (isClusterRunning(clusterStatus) && url) {
      dispatch(addClusterUrl(url));
    }
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

export const clearClusterError = (): WorkBenchActionTypes => ({
  type: WorkBenchActions.clearClusterError,
});
