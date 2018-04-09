import * as React from 'react';
import { compose } from 'recompose';

import { injectState } from 'freactal';
import { withTheme } from 'emotion-theming';
import { css } from 'emotion';

import { CAVATICA } from 'common/constants';
import CavaticaConnectModal from './CavaticaConnectModal';
import CavaticaCopyModal from './CavaticaCopyModal';

import cavaticaLogo from 'assets/logomark-cavatica.svg';

const enhance = compose(injectState, withTheme);

const styles = theme => css`.niceWhiteButton {
  border-radius: 19px;
  background-color: #ffffff;
  border: solid 1px #cacbcf;
  font-size: 11px;
  letter-spacing: 0.2px;
  color: ${theme.tertiary};
  padding: 5px 18px 5px 5px;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  text-transform: uppercase;
  font-weight: bold;
  cursor: pointer;
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

const CavaticaCopyButton = ({ state, theme, effects, ...props }) => {
  const connected = state.integrationTokens[CAVATICA];
  const clickAction = connected ? showCopyModal : showConnectModal;
  return (
    <div css={styles(theme)}>
      <button className="niceWhiteButton" onClick={() => clickAction({ effects, props })}>
        <img
          alt=""
          src={cavaticaLogo}
          css={`
            width: 28px;
            margin-right: 7px;
          `}
        />Copy files to Cavatica project
      </button>
    </div>
  );
};

export default enhance(CavaticaCopyButton);
