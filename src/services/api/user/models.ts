import { PaginationViewPerQuery } from '@ferlab/ui/core/components/ProTable/Pagination/constants';
import { TColumnStates } from '@ferlab/ui/core/components/ProTable/types';
import { TSerializedResizableGridLayoutConfig } from '@ferlab/ui/core/layout/ResizableGridLayout';
import { IUser } from '@ferlab/ui/core/pages/CommunityPage/type';

export type TUser = IUser & {
  is_public: boolean;
  organization?: string;
  location_state?: string;
  location_country?: string;
};

export type TUserTableConfig = {
  columns?: TColumnStates;
  viewPerQuery?: PaginationViewPerQuery;
};

export type TUserConfig = {
  data_exploration?: {
    tables?: {
      participants?: TUserTableConfig;
      biospecimens?: TUserTableConfig;
      datafiles?: TUserTableConfig;
    };
    summary?: {
      layouts?: TSerializedResizableGridLayoutConfig[];
    };
  };
  files?: {
    tables?: {
      biospecimens?: TUserTableConfig;
      experimental_procedures?: TUserTableConfig;
    };
  };
  participants?: {
    tables?: {
      diagnosis?: TUserTableConfig;
      family?: TUserTableConfig;
      phenotype?: TUserTableConfig;
      biospecimens?: TUserTableConfig;
    };
  };
  dashboard?: {
    cards?: {
      order?: string[];
    };
  };
  variants?: {
    tables?: {
      variants?: TUserTableConfig;
    };
  };
  study?: {
    tables?: {
      study?: TUserTableConfig;
    };
  };
};

export enum TUserGroups {
  BETA = 'kf-beta',
}

export type TUserInsert = Omit<TUser, 'id' | 'keycloak_id' | 'creation_date' | 'update_date'>;
export type TUserUpdate = Partial<TUserInsert>;
