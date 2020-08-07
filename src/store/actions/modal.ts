export enum ActionTypes {
  OPEN_MODAL,
  CLOSE_MODAL,
}

export type ActionResponseType = {
  type: ActionTypes;
  id: string;
};

export const openModal = (id: string) => ({
  type: ActionTypes.OPEN_MODAL,
  id,
});

export const closeModal = (id: string) => ({
  type: ActionTypes.CLOSE_MODAL,
  id,
});
