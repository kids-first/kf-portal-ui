import { ReportState } from './reportTypes';
import { FileSearchFiltersState } from './fileSearchFiltersTypes';
import { VirtualStudiesState } from './virtualStudiesTypes';
import { CurrentVirtualStudyTypes } from './currentVirtualStudyTypes';
import { SaveSetState } from './saveSetTypes';
import { UserState } from './userTypes';
import { ModalStateType } from './reducers/modal';
import { GenomicSuggesterState } from './genomicSuggesterTypes';
import { WorkBenchState } from './WorkBenchTypes';

// transition from js to tsx => When possible add correct state for each sub state.
export interface RootState {
  virtualStudies: VirtualStudiesState;
  currentVirtualStudy: CurrentVirtualStudyTypes;
  user: UserState;
  ui: any;
  errors: any;
  enableFeatures: any;
  report: ReportState;
  fileSearchFilters: FileSearchFiltersState;
  saveSets: SaveSetState;
  modal: ModalStateType;
  genomicSuggester: GenomicSuggesterState;
  workBench: WorkBenchState;
}
