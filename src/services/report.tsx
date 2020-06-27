import { format } from 'date-fns';
import { EGO_JWT_KEY } from 'common/constants';
import downloader from 'common/downloader';
import { arrangerProjectId, reportsApiRoot } from 'common/injectGlobals';
import { ReportConfig } from 'store/reportTypes';
import isEmpty from 'lodash/isEmpty';
import { Sqon, SqonFilters } from 'store/sqon';
import { familyMemberAndParticipantIds } from './participants';
import { TRACKING_EVENTS, trackUserInteraction } from './analyticsTracking';
import uniq from 'lodash/uniq';
import { fetchPtIdsFromSaveSets } from './sets';
import {
  extractSaveSetIdsFromSqon,
  removeSaveSetFilters,
  shapeFileTypeSqonFiltersForParticipantType,
} from 'store/sqonUtils';

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
  /*
   * - Assumes that the sqon query in the file repository only has "AND" operators;
   * - Save sets must be managed independently;
   * */
  const saveSetIds = extractSaveSetIdsFromSqon(originalSqon);
  const saveSetsDetected = saveSetIds.length > 0;
  const ptIds = saveSetsDetected ? await fetchPtIdsFromSaveSets(saveSetIds) : [];

  if (reportName === RP_FAM_CLINICAL_DATA_FILE_REPO_KEY) {
    //searches in file index
    const sqonFiltersForSaveSet = saveSetsDetected
      ? [{ op: 'in', content: { field: 'participants.kf_id', value: [...ptIds] } }]
      : [];
    const reshapedSqonFiltersExceptSaveSet = removeSaveSetFilters(
      originalSqon.content as SqonFilters[],
    );
    const sqonFileCentric = {
      op: 'and',
      content: [...reshapedSqonFiltersExceptSaveSet, ...sqonFiltersForSaveSet],
    };
    return shapeSqonForFamilyRp(sqonFileCentric);
  }

  //searches in participant index
  const sqonFiltersForSaveSet = saveSetsDetected
    ? [{ op: 'in', content: { field: 'kf_id', value: [...ptIds] } }]
    : [];
  const reshapedSqonFiltersExceptSaveSet = shapeFileTypeSqonFiltersForParticipantType(originalSqon);
  return {
    op: 'and',
    content: [...reshapedSqonFiltersExceptSaveSet, ...sqonFiltersForSaveSet],
  };
};

export default async (config: ReportConfig) => {
  const name = config.name;

  await trackDownload(name);

  const egoJwt = localStorage.getItem(EGO_JWT_KEY);

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
      projectId: arrangerProjectId,
      filename: format(new Date(), `[${name}_]YYYYMMDD[.xlsx]`),
    },
    headers: {
      Authorization: `Bearer ${egoJwt}`,
      Accept: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      'Content-Type': 'application/json',
    },
  });
};
