import React from 'react';
import { compose } from 'recompose';
import { Trans } from 'react-i18next';
import { css } from 'react-emotion';
import { withTheme } from 'emotion-theming';
import { injectState } from 'freactal';

import DownloadIcon from 'icons/DownloadIcon';
import { ActionButton } from 'uikit/Button';
import FamilyManifestModal from '../FamilyManifestModal';
import { TealActionButton } from '../../uikit/Button';

export default compose(injectState, withTheme)(({ theme, effects: { setModal }, ...props }) => (
  <TealActionButton
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
    <Trans>Download</Trans>
  </TealActionButton>
));
