import { ReportState } from './reportTypes';
// transition from js to tsx => When possible add correct state for each sub state.
export interface RootState {
  virtualStudies: any;
  currentVirtualStudy: any;
  user: any;
  ui: any;
  errors: any;
  enableFeatures: any;
  report: ReportState;
}
