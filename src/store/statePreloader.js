import { loadDraftVirtualStudy } from '../services/virtualStudies';
import { initialState as cohortBuilderInitialState } from './reducers/cohortBuilder';

const preloadState = () => {
  const currentVirtualStudy = loadDraftVirtualStudy() || {};
  const preloadedState = {
    cohortBuilder: {
      ...cohortBuilderInitialState,
      ...currentVirtualStudy,
    },
  };
  return preloadedState;
};

export default preloadState;
