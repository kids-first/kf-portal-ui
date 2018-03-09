import * as React from 'react';
import { compose } from 'recompose';

import { injectState } from 'freactal';

import CavaticaInput from './CavaticaTokenInput';

import cavaticaLogo from 'assets/logomark-cavatica.svg';

const enhance = compose(injectState);

const CavaticaConnectButton = ({ state, effects, ...props }) => {
  return (
    <div css={props.styles}>
      <button
        className="niceWhiteButton"
        onClick={() =>
          effects.setModal({
            title: 'How to Connect to Cavatica',
            component: (
              <CavaticaInput onComplete={effects.unsetModal} onCancel={effects.unsetModal} />
            ),
          })
        }
      >
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

export default enhance(CavaticaConnectButton);
