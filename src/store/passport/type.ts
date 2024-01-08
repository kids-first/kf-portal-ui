import {
  CAVATICA_ANALYSE_STATUS,
  PASSPORT_AUTHENTIFICATION_STATUS,
} from '@ferlab/ui/core/components/Widgets/Cavatica/type';
import { IFileEntity } from 'graphql/files/models';

import { ICavaticaBillingGroup, ICavaticaProject } from 'services/api/cavatica/models';

export type InitialState = {
  cavatica: {
    authentification: {
      status: PASSPORT_AUTHENTIFICATION_STATUS;
      error: boolean;
      loading: boolean;
    };
    projects: {
      data: ICavaticaProject[];
      loading: boolean;
      error?: any;
    };
    billingGroups: {
      data: ICavaticaBillingGroup[];
      loading: boolean;
      error?: any;
    };
    bulkImportData: {
      loading: boolean;
      files: IFileEntity[];
      authorizedFiles: IFileEntity[];
      status: CAVATICA_ANALYSE_STATUS;
    };
  };
};
