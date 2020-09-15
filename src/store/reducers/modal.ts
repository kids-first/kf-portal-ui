import { ActionTypes, ActionResponseType } from '../actions/modal';

export type ModalStateType = {
  isVisible: boolean;
  id: string;
};
const initialState: ModalStateType = { isVisible: false, id: '' };

export default (state = initialState, action: ActionResponseType) => {
  switch (action.type) {
    case ActionTypes.OPEN_MODAL:
      return {
        isVisible: true,
        id: action.id,
      };
    case ActionTypes.CLOSE_MODAL:
      return {
        isVisible: false,
        id: '',
      };
    default:
      return state;
  }
};
