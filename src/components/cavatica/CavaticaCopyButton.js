import * as React from 'react';
import { compose } from 'recompose';
import { injectState } from 'freactal';
import { withTheme } from 'emotion-theming';
import styled from 'react-emotion';

import { CAVATICA } from 'common/constants';
import CavaticaConnectModal from './CavaticaConnectModal';
import CavaticaCopyModal from './CavaticaCopyModal';

import { BigWhiteButton } from 'uikit/Button';

import cavaticaLogo from 'assets/logomark-cavatica.svg';

const ButtonContent = styled('span')`
  ${({ theme }) => theme.row};
  ${({ theme }) => theme.center};
  font-size: 11px;
  letter-spacing: 0.2px;
  color: ${({ theme }) => theme.tertiary};
  padding: 5px 18px 5px 5px;
  text-transform: uppercase;
  font-weight: bold;
`;

const CavaticaLogo = styled('img')`
  width: 28px;
  margin-right: 7px;
`;

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

const CavaticaCopyButton = compose(injectState, withTheme)(
  ({ state, theme, effects, disabled, ...props }) => {
    const connected = state.integrationTokens[CAVATICA];
    const clickAction = connected ? showCopyModal : showConnectModal;
    return (
      <BigWhiteButton disabled={disabled} onClick={() => clickAction({ effects, props })}>
        <ButtonContent>
          <CavaticaLogo alt="" src={cavaticaLogo} />
          Copy files to Cavatica project
        </ButtonContent>
      </BigWhiteButton>
    );
  },
);

export default CavaticaCopyButton;
