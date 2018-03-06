import * as React from 'react';
import { compose, withState } from 'recompose';

import step2Screenshot from 'assets/cavaticaTokenScreenshot.png';
import { deleteSecret, setSecret } from 'services/secrets';
import { CAVATICA } from 'common/constants';
import { getUser as getCavaticaUser } from 'services/cavatica';
import { ModalFooter } from 'components/Modal/index.js';
import ExternalLink from 'uikit/ExternalLink';

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
  display: flex;
  justify-content: center;
  align-items: center;
`;

const TokenTitle = styled.span`
  padding: 20px;
  color: ${props => props.theme.secondary};
  font-size: 18px;
  font-weight: bold;
`;

const FormErrorMessage = styled.div`
  color: ${props => props.theme.primary};
  padding: 10px;
  padding-left: 20px;
`;

const styles = css`
  .tokenInput {
    margin: 20px;
    padding: 3px;
    font-size: 16px;
    border-radius: 10px;
  }

  .stepRow {
    display: flex;
    flex-direction: row;
  }

  .stepText {
    padding-top: 20px;
  }
`;

const enhance = compose(
  injectState,
  withState('cavaticaKey', 'setCavaticaKey', ''),
  withState('invalidToken', 'setInvalidToken', false),
);

const errorTextId = 'cavaticaTokenErrorMsg';

const submitCavaticaToken = async ({
  token,
  setIntegrationToken,
  setInvalidToken,
  onSuccess,
  onFail,
}) => {
  await setSecret({ service: CAVATICA, secret: token });
  getCavaticaUser(token)
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
  invalidToken,
  setInvalidToken,
  ...props
}) => {
  console.log(!cavaticaKey.length);
  return (
    <div css={styles}>
      <div>
        <div className="stepRow">
          <div>
            <NumberBullet>1</NumberBullet>
          </div>
          <div className="stepText">
            <span>
              If you don't have one, please{' '}
              <ExternalLink href="https://pgc-accounts.sbgenomics.com/auth/register/">
                register for a Cavatica Account <RightArrows />
              </ExternalLink>{' '}
            </span>
          </div>
        </div>
        <div className="stepRow">
          <div>
            <NumberBullet>2</NumberBullet>
          </div>
          <div className="stepText">
            <span>
              You will need to retrieve your authentication token from the Cavatica{' '}
              <ExternalLink href="https://cavatica.sbgenomics.com/developer#token">
                Developer Dashboard
              </ExternalLink>. From the Dashboard, click on the "Auth Token" tab.
            </span>
          </div>
          <div>
            <img
              css="width: 300px;"
              src={step2Screenshot}
              alt="Screenshot of Cavatica's Developer Den"
            />
          </div>
        </div>
        <div className="stepRow">
          <div>
            <NumberBullet>3</NumberBullet>
          </div>
          <div className="stepText">
            <span>
              Click on "Generate Token", copy and paste it into the field below and click Connect.
            </span>
          </div>
        </div>
        <div css="display:flex; flex-direction:column;">
          <TokenTitle>Cavatica Authentication Token:</TokenTitle>
          <input
            className="tokenInput"
            id="cavaticaKey"
            type="text"
            value={cavaticaKey}
            name="cavatica"
            placeholder="Cavatica Key"
            onChange={e => {
              setCavaticaKey(e.target.value);
              setInvalidToken(false);
            }}
          />
          <FormErrorMessage id="cavaticaTokenErrorMsg">
            {invalidToken ? 'The provided Cavatica Token is invalid. Update and try again.' : ''}
          </FormErrorMessage>
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
          submitDisabled: invalidToken || !cavaticaKey.length,
        }}
      />
    </div>
  );
};

export default enhance(CavaticaTokenInput);
