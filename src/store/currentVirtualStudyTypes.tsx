import { VirtualStudy } from './virtualStudiesTypes';

export interface CurrentVirtualStudyTypes extends VirtualStudy {
  areSqonsEmpty: boolean;
  isLoading: boolean;
  error: Error | null;
}
