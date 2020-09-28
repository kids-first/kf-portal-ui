import { Sqon } from './sqon';

export type VirtualStudy = {
  activeIndex: number;
  creationDate: string;
  description: string;
  dirty: boolean;
  name: string;
  sharedPublicly: boolean;
  sqons: Sqon[];
  uid: string;
  virtualStudyId: string;
};

export interface VirtualStudiesState {
  studies: VirtualStudy[];
  isLoading: boolean;
  error: Error | null;
}
