import { useSelector } from "react-redux";
import {reportSelector} from "./selector";

export type { initialState as ReportInitialState } from "./types";
export { default, ReportState } from "./slice";
export const useReport = () => useSelector(reportSelector);
