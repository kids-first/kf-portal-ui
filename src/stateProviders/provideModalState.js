import { provideState } from 'freactal';

export default provideState({
  initialState: props => ({
    modalState: {
      isShown: false,
    },
  }),
  effects: {
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
