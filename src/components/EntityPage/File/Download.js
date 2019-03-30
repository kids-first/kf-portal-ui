import React, { Fragment } from 'react';
import { compose } from 'recompose';
import styled from 'react-emotion';
import urlJoin from 'url-join';
import { withTheme } from 'emotion-theming';

import DownloadFileButton from 'components/FileRepo/DownloadFileButton';
import DownloadButton from 'uikit/DownloadButton';
import ExternalLink from 'uikit/ExternalLink';

import ControlledAccessIcon from 'icons/ControlledAccessIcon';

import { kfWebRoot } from 'common/injectGlobals';

import { withApi } from 'services/api';

const LockedText = styled('span')`
  margin-left: 8px;
  margin-right: 1px;
`;

const ControlledDownload = styled('div')`
  color: ${({ theme }) => theme.lightBlue};
  font-size: 14px;
  font-weight: 500;

  a {
    color: ${({ theme }) => theme.primaryLight};
  }
`;

const StyledDownloadButton = styled(DownloadButton)`
  height: 27px;
  padding: 0 13px;
  align-items: center;
  margin-right: 10px;
  font-weight: 600;
`;

const Download = compose(
  withApi,
  withTheme,
)(({ kfId, fence, theme, disabled, ...props }) =>
  disabled ? (
    <Fragment>
      <DownloadFileButton
        kfId={kfId}
        fence={fence}
        render={props => <StyledDownloadButton {...props} disabled />}
        {...props}
      />

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
    </Fragment>
  ) : (
    <DownloadFileButton
      kfId={kfId}
      fence={fence}
      render={props => <StyledDownloadButton {...props} />}
      {...props}
    />
  ),
);

export default Download;
