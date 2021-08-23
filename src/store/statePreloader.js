import { loadDraftVirtualStudy } from '../services/virtualStudies';

import { initialState as currentVirtualStudyInitialState } from './reducers/currentVirtualStudy';
import { fenceConnectionsInitialState } from './fenceConnectionsTypes';
import { AllFencesNames } from './fenceTypes';
import { userInitialState } from './userTypes';

const preloadState = () => {
  const currentVirtualStudy = loadDraftVirtualStudy() || {};
  return {
    currentVirtualStudy: {
      ...currentVirtualStudyInitialState,
      ...currentVirtualStudy,
    },
    user: {
      ...userInitialState,
      isLoadingUser: true,
    },
    fenceConnections: {
      loadingFences: [...AllFencesNames],
      ...fenceConnectionsInitialState,
    },
  };
};

export default preloadState;
