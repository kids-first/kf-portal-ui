import memoizeOne from 'memoize-one';
import { saveDraftVirtualStudy } from 'services/virtualStudies';

const updateDraftVirtualStudy = memoizeOne(saveDraftVirtualStudy);
export default store => {
  const state = store.getState();
  updateDraftVirtualStudy(state.currentVirtualStudy);
};
