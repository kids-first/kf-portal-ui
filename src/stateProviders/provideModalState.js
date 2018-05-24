import { provideState } from 'freactal';

import { addStateInfo as addUsersnapInfo } from 'services/usersnap';
import { trackUserInteraction, TRACKING_EVENTS } from 'services/analyticsTracking';
import history from 'services/history';

const internalState = {
  unsubscribe: null,
};

const initialState = {
  title: null,
  component: null,
  classNames: null,
};

export default provideState({
  initialState: props => ({
    modalState: initialState,
  }),
  effects: {
    setModal: (effects, { title, component, classNames }) => state => {
      history.push({ ...history.location, hash: '#!' });
      internalState.unsubscribe = history.listen(() => effects.unsetModal({ fromHistory: true }));

      const modalState = { title, component, classNames };
      trackUserInteraction({
        category: TRACKING_EVENTS.categories.modals,
        action: TRACKING_EVENTS.actions.open,
        label: title,
      });
      addUsersnapInfo({ modalState });
      return { ...state, modalState };
    },
    unsetModal: (effects, { fromHistory = false } = {}) => state => {
      if (internalState.unsubscribe) {
        internalState.unsubscribe();
        internalState.unsubscribe = null;
      }
      if (!fromHistory) history.goBack();

      trackUserInteraction({
        category: TRACKING_EVENTS.categories.modals,
        action: TRACKING_EVENTS.actions.close,
        label: state.modalState.title,
      });
      addUsersnapInfo({ modalState: initialState });
      return { ...state, modalState: initialState };
    },
  },
});
