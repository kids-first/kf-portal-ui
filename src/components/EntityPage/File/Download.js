import React from 'react';
import { compose, withState, lifecycle } from 'recompose';
import styled from 'react-emotion';
import urlJoin from 'url-join';
import { withTheme } from 'emotion-theming';

import DownloadFileButton from 'components/FileRepo/DownloadFileButton';
import DownloadButton from 'uikit/DownloadButton';
import ExternalLink from 'uikit/ExternalLink';
import Row from 'uikit/Row';

import ControlledAccessIcon from 'icons/ControlledAccessIcon';
import ChevronIcon from 'icons/ChevronIcon';

import { kfWebRoot } from 'common/injectGlobals';

import { getUser } from 'services/gen3';
import { withApi } from 'services/api';

const LockedText = styled('div')`
  margin-left: 8px;
  margin-right: 1px;
`;

const ControlledDownload = styled(Row)`
  color: ${({ theme }) => theme.lightBlue};
  font-size: 14px;
  font-weight: 500;
  align-items: center;

  a {
    color: ${({ theme }) => theme.primaryLight};
  }
`;

const RotatedChevron = props => (
  <ChevronIcon transform={'rotate(-90)'} width={8} height={8} {...props} />
);

const Download = compose(
  withApi,
  withTheme,
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
)(({ kfId, acl, loading, projectIds, theme }) => {
  return loading ? (
    <div>loading</div>
  ) : acl.some(code => projectIds.includes(code)) ? (
    <DownloadFileButton kfId={kfId} render={props => <DownloadButton {...props} />} />
  ) : (
    <ControlledDownload>
      <ControlledAccessIcon fill="#008199" width={12} height={12} />
      <LockedText>File is locked.</LockedText>
      <ExternalLink
        hasExternalIcon={false}
        href={urlJoin(kfWebRoot, '/support/studies-and-access/#applying-for-data-access')}
      >
        {' '}
        Apply for access &raquo;
      </ExternalLink>
    </ControlledDownload>
  );
});

export default Download;
