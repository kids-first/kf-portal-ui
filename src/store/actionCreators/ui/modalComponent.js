import { MODAL_OPEN, MODAL_CLOSE } from '../../actionTypes';

export const setModal = payload => {
  return {
    type: MODAL_OPEN,
    payload,
  };
};

export const closeModal = () => {
  return {
    type: MODAL_CLOSE,
  };
};
