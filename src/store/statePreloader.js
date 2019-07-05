import { loadDraftVirtualStudy } from '../services/virtualStudies';
import { initialState as currentVirtualStudyInitialState } from './reducers/currentVirtualStudy';

const preloadState = () => {
  const currentVirtualStudy = loadDraftVirtualStudy() || {};
  const preloadedState = {
    currentVirtualStudy: {
      ...currentVirtualStudyInitialState,
      ...currentVirtualStudy,
    },
  };
  return preloadedState;
};

export default preloadState;
