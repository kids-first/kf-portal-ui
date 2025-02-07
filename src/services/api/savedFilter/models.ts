import { ISavedFilter } from '@ferlab/ui/core/components/QueryBuilder/types';

export type TUserSavedFilter = ISavedFilter & {
  keycloak_id: string;
  tag: string;
  creation_date?: string;
  updated_date?: string;
};

export enum SavedFilterTag {
  ParticipantsExplorationPage = 'participants-data-exploration-page',
  VariantsExplorationPage = 'variants-variants-exploration-page',
  VariantsSomaticExplorationPage = 'variants-variants-somatic-exploration-page',
}

export type TUserSavedFilterInsert = Omit<
  TUserSavedFilter,
  'keycloak_id' | 'updated_date' | 'creation_date'
>;
export type TUserSavedFilterUpdate = Partial<
  Omit<TUserSavedFilter, 'keycloak_id' | 'updated_date' | 'creation_date'>
>;
