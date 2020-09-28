import { VirtualStudy } from './virtualStudiesTypes';
import { UserSet } from './saveSetTypes';

export interface CurrentVirtualStudyTypes extends VirtualStudy {
  areSqonsEmpty: boolean;
  isLoading: boolean;
  error: Error | null;
  set: UserSet | null;
}
