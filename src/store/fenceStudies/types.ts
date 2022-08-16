import { FENCE_NAMES } from 'common/fenceTypes';

export type initialState = {
  studies: TFenceStudies;
  loadingStudiesForFences: FENCE_NAMES[];
  fencesError: FENCE_NAMES[];
};

export type TAclsByFenceName = {
  [fenceName: string]: string[];
};

export type TFenceStudy = {
  acl: string[];
  studyShortName: string;
  totalFiles: number;
  id: string;
  authorizedFiles: number;
};

export type TFenceStudies = {
  [fenceName: string]: {
    authorizedStudies: TFenceStudy[];
  };
};

export type TFenceStudiesIdsAndCount = {
  [fenceName: string]: {
    authorizedFiles: number;
  };
};
