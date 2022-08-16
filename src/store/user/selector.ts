import { RootState } from "store/types";
import { initialState } from "store/user/types";

export type UserProps = initialState;

export const userSelector = (state: RootState) => {
  return state.user;
};
