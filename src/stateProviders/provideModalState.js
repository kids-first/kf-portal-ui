import { provideState } from 'freactal';

export default provideState({
  initialState: props => ({
    modalState: {
      title: null,
      component: null,
    },
  }),
  effects: {
    setModal: (effects, { title, component }) => state => ({
      ...state,
      modalState: {
        title,
        component,
      },
    }),
    unsetModal: effects => state => {
      return {
        ...state,
        modalState: {
          title: null,
          component: null,
        },
      };
    },
  },
});
