import { provideState } from 'freactal';

import { addStateInfo as addUsersnapInfo } from 'services/usersnap';
import { trackUserInteraction } from 'services/analyticsTracking';

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
        category: 'Modals',
        action: 'Open',
        label: title
      });
      addUsersnapInfo({ modalState });
      return { ...state, modalState };
    },
    unsetModal: effects => state => {
      trackUserInteraction({
        category: 'Modals',
        action: 'Close',
        label: state.modalState.title
      });
      addUsersnapInfo({ modalState: initialState });
      return { ...state, modalState: initialState };
    },
  },
});
