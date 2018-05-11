import { provideState } from 'freactal';

import { addStateInfo as addUsersnapInfo } from 'services/usersnap';
import { trackUserInteraction, TRACKING_EVENTS } from 'services/analyticsTracking';

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
      const modalState = { title, component, classNames };
      trackUserInteraction({
        category: TRACKING_EVENTS.categories.modals,
        action: TRACKING_EVENTS.actions.open,
        label: title
      });
      addUsersnapInfo({ modalState });
      return { ...state, modalState };
    },
    unsetModal: effects => state => {
      trackUserInteraction({
        category: TRACKING_EVENTS.categories.modals,
        action: TRACKING_EVENTS.actions.close,
        label: state.modalState.title
      });
      addUsersnapInfo({ modalState: initialState });
      return { ...state, modalState: initialState };
    },
  },
});
