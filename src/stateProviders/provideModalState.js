import { provideState } from 'freactal';

export default provideState({
  initialState: props => ({
    modalState: {
      isShown: false,
      component: null,
    },
  }),
  effects: {
    setModal: (effects, component) => state => ({
      ...state,
      modalState: {
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
