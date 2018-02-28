import { provideState } from 'freactal';

export default provideState({
  initialState: props => ({
    toast: { action: null, id: null, component: null, closed: false },
  }),
  effects: {
    setToast: (effects, { action, id, component }) => state => ({
      ...state,
      toast: { action, id, component, closed: false },
    }),
    closeToast: effects => state => ({
      ...state,
      toast: { ...state.toast, closed: true },
    }),
  },
});
