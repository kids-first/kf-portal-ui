import { provideState } from 'freactal';

import { addStateInfo as addUsersnapInfo } from 'services/usersnap';
import { trackUserInteraction, TRACKING_EVENTS } from 'services/analyticsTracking';
import history from 'services/history';

const internalState = {
  unlisten: null,
  unblock: null,
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
      internalState.unlisten = history.listen(effects.unsetModal);
      internalState.unblock = history.block(
        'Your changes may not be saved, are you sure you want to leave this page?',
      );

      const modalState = { title, component, classNames };
      trackUserInteraction({
        category: TRACKING_EVENTS.categories.modals,
        action: TRACKING_EVENTS.actions.open,
        label: title,
      });
      addUsersnapInfo({ modalState });
      return { ...state, modalState };
    },
    unsetModal: (effects, { callback = () => {} } = {}) => state => {
      if (internalState.unblock) {
        internalState.unblock();
        internalState.unblock = null;
      }
      if (internalState.unlisten) {
        internalState.unlisten();
        internalState.unlisten = null;
      }
      callback();
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
