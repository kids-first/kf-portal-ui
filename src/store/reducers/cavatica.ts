import { CavaticaActions, CavaticaActionTypes, CavaticaState } from '../cavaticaTypes';
import { ConnectionStatus } from '../connectionTypes';
import { LogoutAction, UserActions } from '../userTypes';

const initialState: CavaticaState = {
  isConnecting: false,
  isConnected: false,
  status: ConnectionStatus.unknown,
};

export default (
  state = initialState,
  action: CavaticaActionTypes | LogoutAction,
): CavaticaState => {
  switch (action.type) {
    case CavaticaActions.toggleIsConnecting: {
      return { ...state, isConnecting: action.isChecking };
    }
    case CavaticaActions.addConnectionStatus: {
      const newStatus = action.newStatus;
      return {
        ...state,
        isConnected: newStatus === ConnectionStatus.connected,
        status: action.newStatus,
      };
    }
    case UserActions.logout: {
      return { ...initialState };
    }
    default:
      return state;
  }
};
