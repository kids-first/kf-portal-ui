import { provideState } from 'freactal';

import { addStateInfo as addUsersnapInfo } from 'services/usersnap';
import { TRACKING_EVENTS } from 'common/constants';
import { trackUserInteraction } from 'services/analyticsTracking';
import history from 'services/history';

const internalState = {
  unlisten: null,
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
      const modalState = { title, component, classNames };
      trackUserInteraction({
        category: TRACKING_EVENTS.categories.modals,
        action: TRACKING_EVENTS.actions.open,
        label: title,
      });
      addUsersnapInfo({ modalState });
      return { ...state, modalState };
    },
    unsetModal: effects => state => {
      if (internalState.unlisten) {
        internalState.unlisten();
        internalState.unlisten = null;
      }
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
