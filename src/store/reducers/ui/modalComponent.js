import { noop } from 'lodash';
import { MODAL_CLOSE, MODAL_OPEN } from '../../actionTypes';

const initialState = {
  header: null,
  component: null,
  footer: null,
  // confirm
  onConfirm: noop,
  confirmLabel: null,
  confirmDisabled: false,
  // cancel
  onCancel: noop,
  cancelLabel: null,
  cancelDisabled: false,
  // modal className
  className: '',
  // classNames of different parts of the modal
  classNames: {
    overlay: '',
    content: '',
  },
};

export default (state = initialState, action) => {
  switch (action.type) {
    case MODAL_OPEN:
      return {
        ...state,
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
