import React, { Fragment } from 'react';
import { compose } from 'recompose';
import urlJoin from 'url-join';

import DownloadFileButton from 'components/FileRepo/DownloadFileButton';
import DownloadButton from 'uikit/DownloadButton';
import ExternalLink from 'uikit/ExternalLink';

import ControlledAccessIcon from 'icons/ControlledAccessIcon';

import { kfWebRoot } from 'common/injectGlobals';

import { withApi } from 'services/api';

import './Download.css';

const Download = compose(withApi)(({ kfId, fence, disabled, ...props }) =>
  disabled ? (
    <Fragment>
      <DownloadFileButton
        kfId={kfId}
        fence={fence}
        render={props => <DownloadButton className="download-button" {...props} disabled />}
        {...props}
      />

      <div className="controlled-download">
        <ControlledAccessIcon fill="#008199" width={12} height={12} />
        <span className="lockedText">File is locked.</span>
        <ExternalLink
          hasExternalIcon={false}
          href={urlJoin(kfWebRoot, '/support/studies-and-access/#applying-for-data-access')}
        >
          {' '}
          Apply for access &raquo;
        </ExternalLink>
      </div>
    </Fragment>
  ) : (
    <DownloadFileButton
      kfId={kfId}
      fence={fence}
      render={props => <DownloadButton className="download-button" {...props} />}
      {...props}
    />
  ),
);

export default Download;
