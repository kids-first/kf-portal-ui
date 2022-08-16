import { RootState } from "store/types";
import { initialState } from "store/savedFilter/types";

export type SavedFilterProps = initialState;

export const savedFilterSelector = (state: RootState) => {
  return state.savedFilter;
};
