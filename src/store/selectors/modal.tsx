import { RootState } from '../rootState';

export const selectIsModalVisible = (state: RootState) => state.modal.isVisible;
export const selectModalId = (state: RootState) => state.modal.id;
