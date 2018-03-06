import * as React from 'react';
import { compose, withState } from 'recompose';

import step2Screenshot from 'assets/cavaticaTokenScreenshot.png';
import { deleteSecret, setSecret } from 'services/secrets';
import { CAVATICA } from 'common/constants';
import { getUser as getCavaticaUser } from 'services/cavatica';
import { ModalFooter } from 'components/Modal/index.js';

import { css } from 'emotion';
import styled from 'react-emotion';
import { injectState } from 'freactal';
import RightArrows from 'react-icons/lib/fa/angle-double-right';

const NumberBullet = styled.span`
  color: white;
  background: ${props => props.theme.active};
  width: 14px;
  border-radius: 50%;
  margin: 20px;
  padding: 10px;
  height: 14px;
  display: inline-block;
  text-align: center;
`;

const TokenTitle = styled.span`
  padding: 20px;
  color: ${props => props.theme.secondary};
  font-size: 18px;
  font-weight: bold;
`;

const styles = css`
  .tokenInput {
    margin: 20px;
    padding: 3px;
    font-size: 16px;
    border-radius: 10px;
  }
`;

const enhance = compose(
  injectState,
  withState('cavaticaKey', 'setCavaticaKey', ''),
  withState('invalidToken', 'setInvalidToken', false),
);

const submitCavaticaToken = async ({ token, setIntegrationToken, onSuccess, onFail }) => {
  await setSecret({ service: CAVATICA, secret: token });
  await getCavaticaUser(token)
    .then(userData => {
      setIntegrationToken(CAVATICA, userData);
      onSuccess();
    })
    .catch(response => {
      setIntegrationToken(CAVATICA, null);
      deleteSecret({ service: CAVATICA });
      onFail();
    });
};

const CavaticaTokenInput = ({
  state,
  effects,
  theme,
  cavaticaKey,
  setCavaticaKey,
  gen3Key,
  setGen3Key,
  editingCavitca,
  setEditingCavatica,
  invalidValue,
  setInvalidToken,
  ...props
}) => {
  return (
    <div css={styles}>
      <div>
        <div>
          <NumberBullet>1</NumberBullet>
          <span>
            If you don't have one, please{' '}
            <a
              href="https://pgc-accounts.sbgenomics.com/auth/register/"
              rel="noopener noreferrer"
              target="_blank"
            >
              register for a Cavatica Account <RightArrows />
            </a>{' '}
          </span>
        </div>
        <div css="display: flex;">
          <div css="flex: 1">
            <NumberBullet>2</NumberBullet>
            <span>
              You will need to retrieve your authentication token from the Cavatica{' '}
              <a
                href="https://cavatica.sbgenomics.com/developer#token"
                rel="noopener noreferrer"
                target="_blank"
              >
                Developer Dashboard
              </a>. From the Dashboard, click on the "Auth Token" tab.
            </span>
          </div>
          <div css="flex: 1;">
            <img
              css="width: 400px;"
              src={step2Screenshot}
              alt="Screenshot of Cavatica's Developer Den"
            />
          </div>
        </div>
        <div>
          <NumberBullet>3</NumberBullet>
          <span>
            Click on "Generate Token", copy and paste it into the field below and click Connect.
          </span>
        </div>
        <div>
          <TokenTitle>Cavatica Authentication Token:</TokenTitle>
          <input
            className="tokenInput"
            id="cavaticaKey"
            type="text"
            value={cavaticaKey}
            name="cavatica"
            placeholder="Cavatica Key"
            onChange={e => setCavaticaKey(e.target.value)}
          />
        </div>
      </div>
      <ModalFooter
        {...{
          handleSubmit: () => {
            submitCavaticaToken({
              token: cavaticaKey,
              setIntegrationToken: effects.setIntegrationToken,
              onSuccess: props.onComplete,
              onFail: () => setInvalidToken(true),
            });
          },
          submitText: 'Connect',
        }}
      />
    </div>
  );
};

export default enhance(CavaticaTokenInput);
