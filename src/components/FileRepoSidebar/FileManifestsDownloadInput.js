import React from 'react';
import { Trans } from 'react-i18next';
import { ColumnsState } from '@arranger/components/dist/DataTable';

import downloadIcon from 'assets/icon-download-white.svg';
import IconWithLoading from 'icons/IconWithLoading';

import Button from 'uikit/Button';

import FamilyManifestModal from '../FamilyManifestModal';

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
      render={({ state: { columns } }) => {
        return (
          <Button
            onClick={() => {
              effects.setModal({
                title: 'Download Manifest',
                component: <FamilyManifestModal {...{ api, sqon, index, projectId, columns }} />,
              });
            }}
          >
            <IconWithLoading icon={downloadIcon} />
            <Trans css={theme.uppercase}>Download</Trans>
          </Button>
        );
      }}
    />
  </div>
);
