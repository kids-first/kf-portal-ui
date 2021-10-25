import { format } from 'date-fns';
import isEmpty from 'lodash/isEmpty';
import uniq from 'lodash/uniq';

import downloader from 'common/downloader';
import { arrangerApiProjectId, reportsApiRoot } from 'common/injectGlobals';
import { ReportConfig } from 'store/reportTypes';
import { Sqon } from 'store/sqon';
import { shapeFileTypeSqonFiltersForParticipantType } from 'store/sqonUtils';

import keycloak from '../keycloak';

import { TRACKING_EVENTS, trackUserInteraction } from './analyticsTracking';
import { familyMemberAndParticipantIds } from './participants';

const trackDownload = async (label: string) => {
  await trackUserInteraction({
    category: TRACKING_EVENTS.categories.reports,
    action: TRACKING_EVENTS.actions.download.report,
    label,
    value: undefined,
  });
};

export const RP_PARTICIPANT_FILE_REPO_KEY = 'clinicalDataFileRepo';
export const RP_CLINICAL_DATA_KEY = 'clinicalData';
export const RP_FAM_CLINICAL_DATA_KEY = 'familyClinicalData';
export const RP_FAM_CLINICAL_DATA_FILE_REPO_KEY = 'familyClinicalDataFileRepo';
export const RP_BIOSPECIMEN_DATA_KEY = 'biospecimenData';
export const RP_BIOSPECIMEN_FILE_REPO_DATA_KEY = 'biospecimenDataFileRepo';

const entry = reportsApiRoot;

const REPORTS_ROUTES = {
  [RP_PARTICIPANT_FILE_REPO_KEY]: `${entry}/reports/clinical-data`,
  [RP_CLINICAL_DATA_KEY]: `${entry}/reports/clinical-data`,
  [RP_FAM_CLINICAL_DATA_KEY]: `${entry}/reports/family-clinical-data`,
  [RP_FAM_CLINICAL_DATA_FILE_REPO_KEY]: `${entry}/reports/family-clinical-data`,
  [RP_BIOSPECIMEN_DATA_KEY]: `${entry}/reports/biospecimen-data`,
  [RP_BIOSPECIMEN_FILE_REPO_DATA_KEY]: `${entry}/reports/biospecimen-data`,
};

const isSqonFromFileRepo = (reportName: string) =>
  [
    RP_PARTICIPANT_FILE_REPO_KEY,
    RP_BIOSPECIMEN_FILE_REPO_DATA_KEY,
    RP_FAM_CLINICAL_DATA_FILE_REPO_KEY,
  ].includes(reportName);

const shapeSqonForFamilyRp = async (originalSqon?: Sqon) => {
  const { getFamilyMembersIds, getParticipantsIds } = await familyMemberAndParticipantIds(
    originalSqon,
  );
  return {
    op: 'in',
    content: {
      field: 'kf_id',
      value: uniq([...getFamilyMembersIds(), ...getParticipantsIds()]),
    },
  };
};

export const shouldCheckAvailability = (reportName: string) =>
  [RP_FAM_CLINICAL_DATA_FILE_REPO_KEY].includes(reportName);

export const checkAvailability = async (reportName: string, sqon: Sqon): Promise<boolean> => {
  if (reportName === RP_FAM_CLINICAL_DATA_FILE_REPO_KEY) {
    const { getFamMembersWithoutPtIds } = await familyMemberAndParticipantIds(sqon);
    return getFamMembersWithoutPtIds().length > 0;
  }
  return true;
};

export const buildSqonFromFileRepoForReport = async (reportName: string, originalSqon: Sqon) => {
  if (reportName === RP_FAM_CLINICAL_DATA_FILE_REPO_KEY) {
    return shapeSqonForFamilyRp(originalSqon);
  }

  //searches in participant index
  const reshapedSqonFilters = shapeFileTypeSqonFiltersForParticipantType(originalSqon);
  return {
    op: 'and',
    content: [...reshapedSqonFilters],
  };
};

export default async (config: ReportConfig) => {
  const name = config.name;

  await trackDownload(name);

  let reportSqon;

  if (!config.sqon || isEmpty(config.sqon)) {
    reportSqon = {
      op: 'and',
      content: [],
    };
  } else if (isSqonFromFileRepo(name)) {
    reportSqon = await buildSqonFromFileRepoForReport(name, config.sqon);
  } else {
    reportSqon = config.sqon;
  }

  return downloader({
    // @ts-ignore
    url: REPORTS_ROUTES[name],
    method: 'POST',
    responseType: 'blob',
    data: {
      sqon: reportSqon,
      projectId: arrangerApiProjectId,
      filename: format(new Date(), `[${name}_]YYYYMMDD[.xlsx]`),
    },
    headers: {
      Authorization: `Bearer ${keycloak.token}`,
      Accept: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      'Content-Type': 'application/json',
    },
  });
};
