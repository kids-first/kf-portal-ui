import * as React from 'react';
import { compose } from 'recompose';
import { injectState } from 'freactal';
import { withTheme } from 'emotion-theming';
import styled from 'react-emotion';

import Row from 'uikit/Row';
import { CAVATICA } from 'common/constants';
import CavaticaConnectModal from './CavaticaConnectModal';
import CavaticaCopyModal from './CavaticaCopyModal';
import { BigWhiteButton, DisabledButton } from 'uikit/Button';
import CavaticaLogo from 'icons/CavaticaLogo';

const CavaticaButton = styled(BigWhiteButton)`
  background: ${({ theme }) => theme.primaryLight};
  width: 100%;
  &:hover {
    background: ${({ theme }) => theme.primary};
  }
  text-transform: uppercase;
  font-weight: bold;
  color: ${({ theme }) => theme.white};
  text-align: center;
  font-size: 13px;
  letter-spacing: 0.2px;

  ${({ buttonStyle }) => (buttonStyle ? buttonStyle : null)}
  ${({ disabled }) =>
    disabled ? DisabledButton : null}
`;

const ButtonContent = styled(Row)`
  ${({ theme }) => theme.center};
  padding: 5px 18px 5px 5px;
  ${({ buttonContentStyle }) => (buttonContentStyle ? buttonContentStyle : null)}
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

const CavaticaCopyButton = compose(
  injectState,
  withTheme,
)(
  ({
    state,
    theme,
    effects,
    disabled,
    buttonStyle,
    buttonContentStyle,
    text = 'Copy files to Cavatica',
    ...props
  }) => {
    const connected = state.integrationTokens[CAVATICA];
    const clickAction = connected ? showCopyModal : showConnectModal;
    return (
      <CavaticaButton
        onClick={() => clickAction({ effects, props })}
        buttonStyle={buttonStyle}
        disabled={disabled}
      >
        <ButtonContent buttonContentStyle={buttonContentStyle}>
          <CavaticaLogo
            width="28"
            fill={disabled ? theme.borderGrey : 'white'}
            style={{ marginRight: '7px' }}
          />
          {text}
        </ButtonContent>
      </CavaticaButton>
    );
  },
);

export default CavaticaCopyButton;
