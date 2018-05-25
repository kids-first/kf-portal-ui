import React from 'react';
import { Trans } from 'react-i18next';
import { ColumnsState } from '@arranger/components/dist/DataTable';
import { withTheme } from 'emotion-theming';

import downloadIcon from 'assets/icon-download-white.svg';
import IconWithLoading from 'icons/IconWithLoading';

import Button from 'uikit/Button';

import FamilyManifestModal from '../FamilyManifestModal';

export const DownloadButton = withTheme(({ theme, ...props }) => (
  <Button {...props}>
    <IconWithLoading icon={downloadIcon} />
    <span css={theme.uppercase}>
      <Trans>Download</Trans>
    </span>
  </Button>
));

export default ({ api, sqon, index, projectId, theme, effects }) => (
  <div
    css={`
      display: flex;
      margin-bottom: 13px;
    `}
  >
    <ColumnsState
      projectId={projectId}
      graphqlField="file"
      render={({ state: { columns } }) => (
        <DownloadButton
          onClick={() => {
            effects.setModal({
              title: 'Download Manifest',
              component: <FamilyManifestModal {...{ api, sqon, index, projectId, columns }} />,
            });
          }}
        />
      )}
    />
  </div>
);
