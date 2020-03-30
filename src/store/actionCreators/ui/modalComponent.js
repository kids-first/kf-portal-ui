import isObject from 'lodash/isObject';
import { MODAL_OPEN, MODAL_CLOSE } from '../../actionTypes';

/**
 * Open the given modal.
 * @param {String} modalName - the name of the modal to open, as it has been registered in `modalFactory`.
 * @param {Object} modalProps - the props to pass to the modal component.
 * @param {String} className - an optional `class` to apply to the modal container.
 */
export const openModal = (modalName, modalProps = {}, className = '') => {
  return {
    type: MODAL_OPEN,
    payload: {
      modalName: String(modalName),
      modalProps: isObject(modalProps) ? modalProps : {},
      className,
    },
  };
};

/**
 * Closes the currently opened modal.
 */
export const closeModal = () => {
  return {
    type: MODAL_CLOSE,
  };
};
