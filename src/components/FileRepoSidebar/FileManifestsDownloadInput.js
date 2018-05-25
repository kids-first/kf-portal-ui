import React from 'react';
import { compose } from 'recompose';
import { Trans } from 'react-i18next';
import { css } from 'react-emotion';
import { withTheme } from 'emotion-theming';
import { injectState } from 'freactal';

import DownloadIcon from 'icons/DownloadIcon';
import { ActionButton } from 'uikit/Button';
import FamilyManifestModal from '../FamilyManifestModal';

export default compose(injectState, withTheme)(({ theme, effects: { setModal }, ...props }) => (
  <div
    css={`
      display: flex;
      margin-bottom: 13px;
    `}
  >
    <ActionButton
      onClick={() =>
        setModal({
          title: 'Download Manifest',
          component: <FamilyManifestModal {...props} />,
        })
      }
    >
      <DownloadIcon
        className={css`
          margin-right: 9px;
        `}
      />
      <span css={theme.uppercase}>
        <Trans>Download</Trans>
      </span>
    </ActionButton>
  </div>
));
