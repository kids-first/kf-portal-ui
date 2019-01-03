import React from 'react';
import { compose, withState, lifecycle } from 'recompose';

import DownloadFileButton from 'components/FileRepo/DownloadFileButton';
import DownloadButton from 'uikit/DownloadButton';

import { getUser } from 'services/gen3';
import { withApi } from 'services/api';

const Download = compose(
  withApi,
  withState('loading', 'setLoading', true),
  withState('projectIds', 'setProjectIds', []),
  lifecycle({
    async componentDidMount() {
      const { api, setProjectIds, setLoading } = this.props;
      const userDetails = await getUser(api);
      const userProjectIds = userDetails ? Object.keys(userDetails.projects) : [];
      setProjectIds(userProjectIds);
      setLoading(false);
    },
  }),
)(({ kfId, acl, loading, projectIds }) => {
  console.log('loading', loading, 'projectIds', projectIds);
  return loading ? (
    <div>loading</div>
  ) : acl.some(code => projectIds.includes(code)) ? (
    <DownloadFileButton kfId={kfId} render={props => <DownloadButton {...props} />} />
  ) : (
    <div>No access</div>
  );
});

export default Download;
