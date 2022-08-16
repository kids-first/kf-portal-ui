import { useSelector } from "react-redux";
import { userSelector } from "./selector";

export type { initialState as UserInitialState } from "./types";
export { default, UserState } from "./slice";
export const useUser = () => useSelector(userSelector);
