import { RootState } from "store/types";
import { initialState } from "store/fenceStudies/types";

export type FenceStudiesProps = initialState;

export const fenceStudiesSelector = (state: RootState) => {
  return state.fenceStudies;
};
