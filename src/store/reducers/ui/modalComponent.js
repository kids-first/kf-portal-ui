import { pick } from 'lodash';
import { MODAL_CLOSE, MODAL_OPEN } from '../../actionTypes';

const initialState = {
  title: '',
  component: null,
  classNames: {
    modal: '',
    overlay: '',
    content: '',
  },
};

export default (state = initialState, action) => {
  switch (action.type) {
    case MODAL_OPEN:
      return {
        ...state,
        ...pick(action.payload, Object.keys(initialState)),
      };
    case MODAL_CLOSE:
      return {
        ...initialState,
      };
    default:
      return state;
  }
};
