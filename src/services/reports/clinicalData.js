import { EGO_JWT_KEY } from 'common/constants';
import downloader from 'common/downloader';
import { arrangerProjectId, reportsApiRoot } from 'common/injectGlobals';

const url = `${reportsApiRoot}/reports/clinical-data`;

export default sqon => {
  const egoJwt = localStorage.getItem(EGO_JWT_KEY);
  return downloader({
    url,
    method: 'POST',
    responseType: 'blob',
    data: {
      sqon,
      projectId: arrangerProjectId,
    },
    headers: {
      Authorization: `Bearer ${egoJwt}`,
      Accept: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    },
  });
};
