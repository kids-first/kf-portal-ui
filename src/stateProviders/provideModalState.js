import { provideState } from 'freactal';

import { trackUserInteraction, TRACKING_EVENTS } from 'services/analyticsTracking';
import history from 'services/history';

const internalState = {
  unlisten: null,
};

const initialState = {
  title: null,
  component: null,
  classNames: null,
  style: null,
};

export default provideState({
  initialState: props => ({
    modalState: initialState,
  }),
  effects: {
    setModal: (effects, { title, component, classNames, style }) => state => {
      internalState.unlisten = history.listen(effects.unsetModal);
      const modalState = { title, component, classNames, style };
      trackUserInteraction({
        category: TRACKING_EVENTS.categories.modals,
        action: TRACKING_EVENTS.actions.open,
        label: title,
      });
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
      return { ...state, modalState: initialState };
    },
  },
});
