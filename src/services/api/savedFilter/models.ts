import { ISavedFilter } from '@ferlab/ui/core/components/QueryBuilder/types';

export type TUserSavedFilter = ISavedFilter & {
  keycloak_id: string;
  tag: string;
  creation_date: string;
  updated_date: string;
};

export type TUserSavedFilterInsert = Omit<
  TUserSavedFilter,
  'keycloak_id' | 'updated_date' | 'creation_date'
>;
export type TUserSavedFilterUpdate = Partial<
  Omit<TUserSavedFilter, 'keycloak_id' | 'updated_date' | 'creation_date'>
>;
