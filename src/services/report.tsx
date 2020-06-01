import { format } from 'date-fns';

import { EGO_JWT_KEY } from 'common/constants';
import downloader from 'common/downloader';
import { arrangerProjectId, reportsApiRoot } from 'common/injectGlobals';
import { ReportConfig } from '../store/reportTypes';
import isEmpty from 'lodash/isEmpty';
import { Sqon, SqonFilters } from '../store/sqon';
import { familyMemberAndParticipantIds } from './participants';
import { TRACKING_EVENTS, trackUserInteraction } from './analyticsTracking';
import uniq from 'lodash/uniq';

const trackDownload = async (label: string) => {
  await trackUserInteraction({
    category: TRACKING_EVENTS.categories.reports,
    action: TRACKING_EVENTS.actions.download.report,
    label,
    value: undefined,
  });
};

export const RP_PARTICIPANT_FILE_REPO_KEY = 'participantFileRepo';
export const RP_CLINICAL_DATA_KEY = 'clinicalData';
export const RP_FAM_CLINICAL_DATA_KEY = 'familyClinicalData';
export const RP_FAM_CLINICAL_DATA_FILE_REPO_KEY = 'familyClinicalDataFileRepo';
export const RP_BIOSPECIMEN_DATA_KEY = 'biospecimenData';
export const RP_BIOSPECIMEN_FILE_REPO_DATA_KEY = 'biospecimenDataFileRepo';

const entry = reportsApiRoot;

const REPORTS_ROUTES = {
  [RP_PARTICIPANT_FILE_REPO_KEY]: `${entry}/reports/clinical-data-participants-only`,
  [RP_CLINICAL_DATA_KEY]: `${entry}/reports/clinical-data`,
  [RP_FAM_CLINICAL_DATA_KEY]: `${entry}/reports/family-clinical-data`,
  [RP_FAM_CLINICAL_DATA_FILE_REPO_KEY]: `${entry}/reports/family-clinical-data`,
  [RP_BIOSPECIMEN_DATA_KEY]: `${entry}/reports/biospecimen-data`,
  [RP_BIOSPECIMEN_FILE_REPO_DATA_KEY]: `${entry}/reports/biospecimen-data`,
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

export const shapeSqonForParticipantRp = async (originalSqon?: Sqon) => {
  const { getParticipantsIds } = await familyMemberAndParticipantIds(originalSqon);
  return {
    op: 'in',
    content: {
      field: 'kf_id',
      value: getParticipantsIds(),
    },
  };
};

export const shapeSqonForBiospecimenRp = (originalSqon?: Sqon) => {
  if (!originalSqon || isEmpty(originalSqon)) {
    return {
      op: 'and',
      content: [],
    };
  }
  const copyOfSqon = { ...originalSqon };

  /*
   * Assumes that the sqon structure is always the same:
   *  {"op":"and","content":[{"op":"in","content":{"field":"kf_id","value":["id1","id2"]}}]}
   * */
  (copyOfSqon.content as SqonFilters[])[0].content.field = 'files.kf_id';

  return copyOfSqon;
};

export const shapeSqonForFamilyRp = async (originalSqon?: Sqon) => {
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
export const buildSqonFromFileRepoForReport = async (reportName: string, originalSqon?: Sqon) => {
  if (reportName === RP_PARTICIPANT_FILE_REPO_KEY) {
    return shapeSqonForParticipantRp(originalSqon);
  } else if (reportName === RP_BIOSPECIMEN_FILE_REPO_DATA_KEY) {
    return shapeSqonForBiospecimenRp(originalSqon);
  } else if (reportName === RP_FAM_CLINICAL_DATA_FILE_REPO_KEY) {
    return shapeSqonForFamilyRp(originalSqon);
  }
  return originalSqon;
};

export default async (config: ReportConfig) => {
  const name = config.name;

  await trackDownload(name);

  const egoJwt = localStorage.getItem(EGO_JWT_KEY);

  const reportSqon = await buildSqonFromFileRepoForReport(name, config.sqon);

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
