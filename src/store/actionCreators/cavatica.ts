import { notification } from 'antd';
import { ThunkAction } from 'redux-thunk';

import { CAVATICA } from '../../common/constants';
import { TRACKING_EVENTS, trackUserInteraction } from '../../services/analyticsTracking';
import { getUser } from '../../services/cavatica';
import { deleteSecret, setSecret } from '../../services/secrets';
import { CavaticaActions, CavaticaActionTypes } from '../cavaticaTypes';
import { ConnectionStatus } from '../connectionTypes';
import { RootState } from '../rootState';
import { selectConnectionStatus } from '../selectors/cavatica';
import { Nullable } from '../utilityTypes';

const NOTIFICATION_DURATION_IN_SEC = 10;

export const toggleIsConnecting = (isChecking: boolean): CavaticaActionTypes => ({
  type: CavaticaActions.toggleIsConnecting,
  isChecking,
});

export const addConnectionStatus = (newStatus: ConnectionStatus): CavaticaActionTypes => ({
  type: CavaticaActions.addConnectionStatus,
  newStatus,
});

export const checkIfUserIsConnected = (): ThunkAction<
  void,
  RootState,
  null,
  CavaticaActionTypes
> => async (dispatch) => {
  dispatch(toggleIsConnecting(true));
  try {
    await getUser();
    dispatch(addConnectionStatus(ConnectionStatus.connected));
  } catch (e) {
    console.error(e);
    dispatch(addConnectionStatus(ConnectionStatus.disconnected));
  } finally {
    dispatch(toggleIsConnecting(false));
  }
};

const shouldFetch = (state: RootState) =>
  selectConnectionStatus(state) !== ConnectionStatus.disconnected;

export const checkIfUserIsConnectedIfNeeded = (): ThunkAction<
  void,
  RootState,
  null,
  CavaticaActionTypes
> => async (dispatch, getState) => {
  if (shouldFetch(getState())) {
    dispatch(checkIfUserIsConnected);
  }
};

type CallBack = () => Promise<void>;

export const deleteCavaticaSecret = (): ThunkAction<
  void,
  RootState,
  null,
  CavaticaActionTypes
> => async () => {
  try {
    await deleteSecret({ service: CAVATICA });
  } catch (e) {
    console.error(e);
  }
};

export const disconnect = (): ThunkAction<void, RootState, null, CavaticaActionTypes> => async (
  dispatch,
) => {
  dispatch(toggleIsConnecting(true));
  try {
    await dispatch(deleteCavaticaSecret());
  } catch (e) {
    console.error(e);
    notification.error({
      message: 'Error',
      description: `En error occurred while disconnecting to Cavatica.`,
      duration: NOTIFICATION_DURATION_IN_SEC,
    });
  } finally {
    dispatch(addConnectionStatus(ConnectionStatus.disconnected));
    dispatch(toggleIsConnecting(false));
  }
};

export const submitToken = (
  token: string,
  onSuccess: Nullable<CallBack>,
  onFail: Nullable<CallBack>,
): ThunkAction<void, RootState, null, CavaticaActionTypes> => async (dispatch) => {
  dispatch(toggleIsConnecting(true));
  try {
    await setSecret({ service: CAVATICA, secret: token });
    await getUser();
    dispatch(addConnectionStatus(ConnectionStatus.connected));
    await trackUserInteraction({
      value: undefined,
      category: TRACKING_EVENTS.categories.user.profile,
      action: TRACKING_EVENTS.actions.integration.connected,
      label: TRACKING_EVENTS.labels.cavatica,
    });
    if (onSuccess) {
      await onSuccess();
    }
  } catch (e) {
    await deleteSecret({ service: CAVATICA });
    dispatch(addConnectionStatus(ConnectionStatus.disconnected));
    await trackUserInteraction({
      value: undefined,
      category: TRACKING_EVENTS.categories.user.profile,
      action: TRACKING_EVENTS.actions.integration.failed,
      label: TRACKING_EVENTS.labels.cavatica,
    });
    if (onFail) {
      await onFail();
    }
  } finally {
    dispatch(toggleIsConnecting(false));
  }
};
