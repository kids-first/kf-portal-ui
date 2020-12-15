import { Link } from 'uikit/Core';
import * as React from 'react';
// eslint-disable-next-line react/prop-types
export default ({ original }) => {
  const { study } = original?.participants.hits.edges[0].node || {};
  const { data_access_authority, external_id } = study;
  return data_access_authority === 'dbGaP' ? <Link to={`/participant/`}>{external_id}</Link> : '';
};
