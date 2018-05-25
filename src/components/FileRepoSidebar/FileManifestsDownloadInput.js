import React from 'react';
import { compose } from 'recompose';
import { Trans } from 'react-i18next';
import { css } from 'react-emotion';
import { withTheme } from 'emotion-theming';
import { injectState } from 'freactal';
import { ColumnsState } from '@arranger/components/dist/DataTable';

import DownloadIcon from 'icons/DownloadIcon';
import Button from 'uikit/Button';
import FamilyManifestModal from '../FamilyManifestModal';

export const DownloadButton = withTheme(({ theme, ...props }) => (
  <Button
    className={css`
      display: flex;
      flex-direction: row;
      justify-content: center;
      width: 140px;
    `}
    {...props}
  >
    <DownloadIcon
      className={css`
        margin-right: 9px;
      `}
    />
    <span css={theme.uppercase}>
      <Trans>Download</Trans>
    </span>
  </Button>
));

export default compose(injectState, withTheme)(
  ({ theme, sqon, index, projectId, effects: { setModal } }) => (
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
            onClick={() =>
              setModal({
                title: 'Download Manifest',
                component: <FamilyManifestModal {...{ sqon, index, projectId, columns }} />,
              })
            }
          />
        )}
      />
    </div>
  ),
);
