import { RootState } from "store/types";
import { initialState } from "store/savedFilter/types";

export type SavedSetProps = initialState;

export const savedSetSelector = (state: RootState) => {
  return state.savedSet;
};
