import { format } from 'date-fns';

import { EGO_JWT_KEY } from 'common/constants';
import downloader from 'common/downloader';
import { arrangerProjectId, reportsApiRoot } from 'common/injectGlobals';

const url = `${reportsApiRoot}/reports/biospecimen-data`;

export default sqon => {
  const egoJwt = localStorage.getItem(EGO_JWT_KEY);
  const filename = format(new Date(), `[biospecimen_]YYYYMMDD[.xlsx]`);
  return downloader({
    url,
    method: 'POST',
    responseType: 'blob',
    data: {
      sqon,
      projectId: arrangerProjectId,
      filename,
    },
    headers: {
      Authorization: `Bearer ${egoJwt}`,
      Accept: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      'Content-Type': 'application/json',
    },
  });
};
