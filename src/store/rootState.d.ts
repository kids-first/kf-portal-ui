import { ReportState } from './reportTypes';
import { FileSearchFiltersState } from './fileSearchFiltersTypes';
// transition from js to tsx => When possible add correct state for each sub state.
export interface RootState {
  virtualStudies: any;
  currentVirtualStudy: any;
  user: any;
  ui: any;
  errors: any;
  enableFeatures: any;
  report: ReportState;
  fileSearchFilters: FileSearchFiltersState;
}
