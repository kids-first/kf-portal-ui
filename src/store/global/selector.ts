import { RootState } from "store/types";
import { initialState } from "store/global/types";

export type GlobalProps = initialState;

export const globalSelector = (state: RootState) => {
  return state.global;
};
