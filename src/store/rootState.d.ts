import { ReportState } from './reportTypes';
import { FileSearchFiltersState } from './fileSearchFiltersTypes';
import { VirtualStudiesState } from './virtualStudiesTypes';
import { CurrentVirtualStudyTypes } from './currentVirtualStudyTypes';
// transition from js to tsx => When possible add correct state for each sub state.
export interface RootState {
  virtualStudies: VirtualStudiesState;
  currentVirtualStudy: CurrentVirtualStudyTypes;
  user: any;
  ui: any;
  errors: any;
  enableFeatures: any;
  report: ReportState;
  fileSearchFilters: FileSearchFiltersState;
}
