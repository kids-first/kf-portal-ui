import { ISyntheticSqon } from '@ferlab/ui/core/data/sqon/types';

export type ReportConfig = {
  sqon: ISyntheticSqon;
  name: string;
  fileName?: string;
  projectId?: string;
  biospecimenRequestName?: string;
  withFamily?: boolean;
};

export enum ReportType {
  CLINICAL_DATA = 'clinicalData',
  CLINICAL_DATA_FAM = 'familyClinicalData',
  BIOSEPCIMEN_DATA = 'biospecimenData',
  BIOSEPCIMEN_REQUEST = 'biospecimenRequest',
  FILE_MANIFEST = 'manifest',
  FILE_MANIFEST_STATS = 'fileManifestStats',
  FILE_REQUEST_ACCESS = 'fileRequestAccess',
  FILE_REQUEST_ACCESS_STATS = 'fileRequestAccessStats',
}

export interface IDownloadTranslation {
  errorMessage?: string;
  successMessage?: string;
}
