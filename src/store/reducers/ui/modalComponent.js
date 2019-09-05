import { MODAL_CLOSE, MODAL_OPEN } from '../../actionTypes';

const initialState = {
  modalName: '',
  modalProps: {},
  className: '',
};

export default (state = initialState, action) => {
  switch (action.type) {
    case MODAL_OPEN:
      return {
        ...initialState,
        ...action.payload,
      };
    case MODAL_CLOSE:
      return {
        ...initialState,
      };
    default:
      return state;
  }
};
