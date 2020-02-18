import ajax from 'services/ajax';
import urljoin from 'url-join';
import { personaApiRoot } from 'common/injectGlobals';

export const reportMember = async body =>
  await ajax.post(urljoin(personaApiRoot, 'reportMember'), {
    ...body,
  });
