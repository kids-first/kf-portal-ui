import * as React from 'react';
import { compose } from 'recompose';

import { injectState } from 'freactal';
import { withTheme } from 'emotion-theming';

import { CAVATICA } from 'common/constants';
import CavaticaConnectModal from './CavaticaConnectModal';
import CavaticaCopyModal from './CavaticaCopyModal';
import NiceWhiteButton from 'uikit/NiceWhiteButton';

import cavaticaLogo from 'assets/logomark-cavatica.svg';

const enhance = compose(injectState, withTheme);

const showConnectModal = ({ effects, props }) => {
  effects.setModal({
    title: 'How to Connect to Cavatica',
    component: (
      <CavaticaConnectModal
        withWarning={true}
        onComplete={() => showCopyModal({ effects, props })}
        onCancel={effects.unsetModal}
      />
    ),
  });
};

const showCopyModal = ({ effects, props }) => {
  effects.setModal({
    title: 'Copy Files to Cavatica Project',
    component: (
      <CavaticaCopyModal onComplete={effects.unsetModal} onCancel={effects.unsetModal} {...props} />
    ),
  });
};

const CavaticaCopyButton = ({ state, theme, effects, ...props }) => {
  const connected = state.integrationTokens[CAVATICA];
  const clickAction = connected ? showCopyModal : showConnectModal;
  return (
    <div>
      <NiceWhiteButton className={theme.row} onClick={() => clickAction({ effects, props })}>
        <img
          alt=""
          src={cavaticaLogo}
          css={`
            width: 28px;
            margin-right: 7px;
          `}
        />Copy files to Cavatica project
      </NiceWhiteButton>
    </div>
  );
};

export default enhance(CavaticaCopyButton);
