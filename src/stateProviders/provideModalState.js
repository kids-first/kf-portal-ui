import { provideState } from 'freactal';

import { addStateInfo as addUsersnapInfo } from 'services/usersnap';

const initialState = {
  title: null,
  component: null,
  classNames: null,
};

export default provideState({
  initialState: props => ({
    modalState: initialState,
  }),
  effects: {
    setModal: (effects, { title, component, classNames }) => state => {
      const modalState = { title, component, classNames };
      addUsersnapInfo({ modalState });
      return { ...state, modalState };
    },
    unsetModal: effects => state => {
      addUsersnapInfo({ modalState: initialState });
      return { ...state, modalState: initialState };
    },
  },
});
