import { provideState } from 'freactal';

export default provideState({
  initialState: props => ({
    modalState: {
      title: null,
      component: null,
      classNames: null,
    },
  }),
  effects: {
    setModal: (effects, { title, component, classNames }) => state => ({
      ...state,
      modalState: {
        title,
        component,
        classNames,
      },
    }),
    unsetModal: effects => state => {
      return {
        ...state,
        modalState: {
          title: null,
          component: null,
          classNames: null,
        },
      };
    },
  },
});
