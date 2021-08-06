import { ModalStateType } from './reducers/modal';
import { CavaticaState } from './cavaticaTypes';
import { CurrentVirtualStudyTypes } from './currentVirtualStudyTypes';
import { FenceConnectionsState } from './fenceConnectionsTypes';
import { FenceStudiesState } from './fenceStudiesTypes';
import { FileSearchFiltersState } from './fileSearchFiltersTypes';
import { GenomicSuggesterState } from './genomicSuggesterTypes';
import { ProfileState } from './profileTypes';
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
  profile: ProfileState;
  ui: any;
  report: ReportState;
  fileSearchFilters: FileSearchFiltersState;
  saveSets: SaveSetState;
  modal: ModalStateType;
  genomicSuggester: GenomicSuggesterState;
  workBench: WorkBenchState;
  savedQueries: SavedQueriesState;
  fenceConnections: FenceConnectionsState;
  fenceStudies: FenceStudiesState;
  cavatica: CavaticaState;
}
