import { provideState } from 'freactal';

export default provideState({
  initialState: props => ({
    modalState: {
      isShown: false,
      content: null,
      title: null,
    },
  }),
  effects: {
    setModal: (effects, { content, title }) => state => ({
      ...state,
      modalState: {
        content,
        isShown: !!content,
        title: title || null,
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
