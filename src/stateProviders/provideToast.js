import { provideState } from 'freactal';

export default provideState({
  initialState: props => ({
    toast: { action: null, id: null, component: null, closed: false },
  }),
  effects: {
    setToast: (effects, { action, id, component }) => state => {
      const toast = { action, id, component, closed: false };
      return { ...state, toast };
    },
    closeToast: effects => state => {
      const toast = { ...state.toast, closed: true };
      return { ...state, toast };
    },
  },
});
