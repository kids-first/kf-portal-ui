import { BooleanOperators } from '@ferlab/ui/core/data/sqon/operators';
import keycloak from 'auth/keycloak-api/keycloak';
import EnvironmentVariables from 'helpers/EnvVariables';
import isEmpty from 'lodash/isEmpty';

import downloader from 'common/downloader';

import { ReportConfig, ReportType } from './models';

const REPORT_API_URL = EnvironmentVariables.configFor('REPORTS_API_URL');
const arrangerProjectId = EnvironmentVariables.configFor('ARRANGER_PROJECT_ID');

export const REPORTS_ROUTES = {
  [ReportType.CLINICAL_DATA]: `${REPORT_API_URL}/reports/clinical-data`,
  [ReportType.CLINICAL_DATA_FAM]: `${REPORT_API_URL}/reports/family-clinical-data`,
  [ReportType.BIOSEPCIMEN_DATA]: `${REPORT_API_URL}/reports/biospecimen-data`,
  [ReportType.FILE_MANIFEST]: `${REPORT_API_URL}/reports/file-manifest`,
  [ReportType.FILE_MANIFEST_STATS]: `${REPORT_API_URL}/reports/file-manifest/stats`,
  [ReportType.FILE_REQUEST_ACCESS]: `${REPORT_API_URL}/reports/file-request-access`,
  [ReportType.FILE_REQUEST_ACCESS_STATS]: `${REPORT_API_URL}/reports/file-request-access/stats`,
};

const joinWithPadding = (l: number[]) => l.reduce((xs, x) => xs + `${x}`.padStart(2, '0'), '');
const makeFilenameDatePart = (date = new Date()) => {
  const prefixes = joinWithPadding([
    date.getUTCFullYear(),
    date.getUTCMonth() + 1,
    date.getUTCDate(),
  ]);
  const suffixes = joinWithPadding([
    date.getUTCHours(),
    date.getUTCMinutes(),
    date.getUTCSeconds(),
  ]);
  return `${prefixes}T${suffixes}Z`;
};

export const headers = () => ({
  'Content-Type': 'application/json',
  Accept: '*/*',
  Authorization: `Bearer ${keycloak.token}`,
});

const generateReport = (config: ReportConfig) => {
  const name = config.name;

  //TODO do we need google analytics tracking?
  let reportSqon;

  if (!config.sqon || isEmpty(config.sqon)) {
    reportSqon = {
      op: BooleanOperators.and,
      content: [],
    };
  } else {
    reportSqon = config.sqon;
  }

  return downloader({
    // @ts-ignore
    url: REPORTS_ROUTES[name],
    method: 'POST',
    responseType: 'blob',
    data: {
      isKfNext: true,
      sqon: reportSqon,
      projectId: arrangerProjectId,
      filename: `kf_${name}_${makeFilenameDatePart(new Date())}.xlsx`,
    },
    headers: headers(),
  });
};

export const ReportApi = {
  generateReport,
};
