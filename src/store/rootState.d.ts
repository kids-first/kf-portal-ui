import { ModalStateType } from './reducers/modal';
import { CurrentVirtualStudyTypes } from './currentVirtualStudyTypes';
import { FenceConnectionsState } from './fenceConnectionsTypes';
import { FenceStudiesState } from './fenceStudiesTypes';
import { FileSearchFiltersState } from './fileSearchFiltersTypes';
import { GenomicSuggesterState } from './genomicSuggesterTypes';
import { ReportState } from './reportTypes';
import { SavedQueriesState } from './SavedQueriesTypes';
import { SaveSetState } from './saveSetTypes';
import { UserState } from './userTypes';
import { VirtualStudiesState } from './virtualStudiesTypes';
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
  savedQueries: SavedQueriesState;
  fenceConnections: FenceConnectionsState;
  fenceStudies: FenceStudiesState;
}
