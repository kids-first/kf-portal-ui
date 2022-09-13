import { FENCE_CONNECTION_STATUSES, FENCE_NAMES } from 'common/fenceTypes';
import { IFenceInfo } from 'services/api/fence/models';

export type TFencesConnectionStatus = {
  [FENCE_NAMES.dcf]: FENCE_CONNECTION_STATUSES;
  [FENCE_NAMES.gen3]: FENCE_CONNECTION_STATUSES;
  [FENCE_NAMES.cavatica]: FENCE_CONNECTION_STATUSES;
};

export type TModalConnectionParams = {
  open: boolean;
  onClose?: () => void;
};

export type initialState = {
  loadingFences: FENCE_NAMES[];
  fencesConnectError: FENCE_NAMES[];
  fencesDisconnectError: FENCE_NAMES[];
  fencesInfo: {
    [FENCE_NAMES.dcf]?: IFenceInfo;
    [FENCE_NAMES.gen3]?: IFenceInfo;
    [FENCE_NAMES.cavatica]?: IFenceInfo;
  };
  fencesAcls: {
    [FENCE_NAMES.dcf]: string[];
    [FENCE_NAMES.gen3]: string[];
    [FENCE_NAMES.cavatica]: string[];
  };
  connectionStatus: {
    [FENCE_NAMES.dcf]: FENCE_CONNECTION_STATUSES;
    [FENCE_NAMES.gen3]: FENCE_CONNECTION_STATUSES;
    [FENCE_NAMES.cavatica]: FENCE_CONNECTION_STATUSES;
  };
  modalConnectionParams: TModalConnectionParams;
};
