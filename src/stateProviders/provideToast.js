import { provideState } from 'freactal';

import { addStateInfo as addUsersnapInfo } from 'services/usersnap';

export default provideState({
  initialState: props => ({
    toast: { action: null, id: null, component: null, closed: false },
  }),
  effects: {
    setToast: (effects, { action, id, component }) => state => {
      const toast = { action, id, component, closed: false };
      addUsersnapInfo({ toast });
      return { ...state, toast };
    },
    closeToast: effects => state => {
      const toast = { ...state.toast, closed: true };
      addUsersnapInfo({ toast });
      return { ...state, toast };
    },
  },
});
