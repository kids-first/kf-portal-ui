import { UserSet } from './saveSetTypes';
import { Sqon } from './sqon';
import { VirtualStudy } from './virtualStudiesTypes';

export interface CurrentVirtualStudyTypes extends VirtualStudy {
  selectionSqon: Sqon;
  areSqonsEmpty: boolean;
  isLoading: boolean;
  error: Error | null;
  set: UserSet | null;
}
