import { Sqon } from './sqon';

export enum StudyPageActionNames {
  SetActiveSqonIndex = 'SetActiveSqonIndex',
  SetSqons = 'SetSqons',
}

type SetActiveSqonIndex = {
  type: StudyPageActionNames.SetActiveSqonIndex;
  payload: number;
};

type SetSqons = {
  type: StudyPageActionNames.SetSqons;
  payload: Sqon[];
};

export type StudyPageActionTypes = SetActiveSqonIndex | SetSqons;
