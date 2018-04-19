import { provideState } from 'freactal';

export default provideState({
  initialState: props => ({
    modalState: {
      title: null,
      component: null,
      style: null,
    },
  }),
  effects: {
    setModal: (effects, { title, component, style }) => state => ({
      ...state,
      modalState: {
        title,
        component,
        style,
      },
    }),
    unsetModal: effects => state => {
      return {
        ...state,
        modalState: {
          title: null,
          component: null,
          style: null,
        },
      };
    },
  },
});
