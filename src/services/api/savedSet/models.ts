import { ISqonGroupFilter } from '@ferlab/ui/core/data/sqon/types';
import { ISort } from '@ferlab/ui/core/graphql/types';

import { ISavedSet } from 'store/savedSet/types';

export type TUserSavedSet = ISavedSet & {
  keycloak_id: string;
  creation_date: string;
  updated_date: string;
};

export type TUpdateSet = ISavedSet & {
  subAction: string;
  newTag?: string;
};

export type IUserSetOutput = {
  updated_date?: string;
  id: string;
  tag: string;
  size: number;
  setType: SetType;
};

export type TBiospecimenRequest = {
  id: string;
  alias: string;
  content: {
    idField: string;
    ids: string[];
    setType: SetType;
    sort: ISort[];
    sqon: ISqonGroupFilter;
  };
  sharedpublicly: boolean;
  keycloak_id: string;
  creation_date: string;
  updated_date: string;
};

export type TUserSavedSetInsert = Omit<
  TUserSavedSet,
  'keycloak_id' | 'updated_date' | 'creation_date'
>;

export type TUserSavedSetUpdate = Partial<ISavedSet> & { subAction: string; newTag?: string };

export enum SetType {
  BIOSPECIMEN_REQUEST = 'biospecimen-request',
  PARTICIPANT = 'participant',
  FILE = 'file',
  BIOSPECIMEN = 'biospecimen',
  VARIANT = 'variants',
}
