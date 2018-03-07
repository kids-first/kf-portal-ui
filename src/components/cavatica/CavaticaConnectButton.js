import * as React from 'react';
import { compose, withState } from 'recompose';

import { css } from 'emotion';
import styled from 'react-emotion';
import { injectState } from 'freactal';

import { CAVATICA } from 'common/constants';
import CavaticaInput from './CavaticaTokenInput';

import cavaticaLogo from 'assets/logomark-cavatica.svg';

const enhance = compose(injectState);

const CavaticaConnectButton = ({ state, effects, ...props }) => {
  return (
    <button
      css={`
        border-radius: 19px;
        background-color: #ffffff;
        border: solid 1px #cacbcf;
        font-size: 11px;
        letter-spacing: 0.2px;
        color: #008199;
        padding: 5px 18px 5px 5px;
        display: flex;
        align-items: center;

        :hover {
          cursor: pointer;
        }
      `}
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
      />Export files to Cavatica
    </button>
  );
};

export default enhance(CavaticaConnectButton);
