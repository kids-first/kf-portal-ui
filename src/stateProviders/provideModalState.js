import { provideState } from 'freactal';

export default provideState({
  initialState: props => ({
    modalState: {
      title: null,
      isShown: false,
      component: null,
    },
  }),
  effects: {
    setModal: (effects, title, component) => state => ({
      ...state,
      modalState: {
        title,
        component,
        isShown: !!component,
      },
    }),
    showModal: effects => state => {
      return {
        ...state,
        modalState: {
          ...state.modalState,
          isShown: true,
        },
      };
    },
    hideModal: effects => state => {
      return {
        ...state,
        modalState: {
          ...state.modalState,
          isShown: false,
        },
      };
    },
  },
});
