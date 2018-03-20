import * as React from 'react';
import { compose, withState } from 'recompose';

import step2Screenshot from 'assets/cavaticaTokenScreenshot.png';
import { deleteSecret, setSecret } from 'services/secrets';
import { CAVATICA } from 'common/constants';
import { getUser as getCavaticaUser } from 'services/cavatica';
import { ModalFooter } from 'components/Modal/index.js';
import ExternalLink from 'uikit/ExternalLink';
import ErrorIcon from 'icons/ErrorIcon';
import { cavaticaWebRoot } from 'common/injectGlobals';

import { css } from 'emotion';
import styled from 'react-emotion';
import { injectState } from 'freactal';
import RightArrows from 'react-icons/lib/fa/angle-double-right';

const ModalWarning = styled.div`
  display: flex;
  flex-direction: row;
  align-items: left;
  background-color: #f9dee1;
  border-radius: 7px;
  border-style: solid;
  border-color: #e45562;
  border-width: 1px;
  padding: 10px;
`;

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
  color: ${props => props.theme.secondary};
  font-size: 18px;
  font-weight: bold;
  margin-bottom: 10px;
`;

const FormErrorMessage = styled.div`
  color: #e45562;
  padding: 10px;
  padding-left: 20px;
  height: 1.6em;
`;

const TokenInput = styled.input`
  padding: 6px;
  font-size: 16px;
  border-radius: 10px;
`;

const styles = css`
  div {
    line-height: 1.6em;
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

const submitCavaticaToken = async ({
  token,
  setIntegrationToken,
  setInvalidToken,
  onSuccess,
  onFail,
}) => {
  await setSecret({ service: CAVATICA, secret: token });
  const userData = await getCavaticaUser(token);

  if (userData) {
    setIntegrationToken(CAVATICA, JSON.stringify(userData));
    onSuccess();
  } else {
    setIntegrationToken(CAVATICA, null);
    deleteSecret({ service: CAVATICA });
    onFail();
  }
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
  return (
    <div css={styles}>
      <div>
        {props.withWarning && (
          <ModalWarning>
            <div
              css={`
                padding-right: 10px;
              `}
            >
              <ErrorIcon width={30} height={30} fill={`#e45562`} />
            </div>
            <div classNAme="warningMessage">
              You have not connected to your Cavatica account. Please follow the instructions below
              to connect and start copying files.
            </div>
          </ModalWarning>
        )}
        <div className="stepRow">
          <div>
            <NumberBullet>1</NumberBullet>
          </div>
          <div className="stepText">
            <span>
              If you don't have one, please{' '}
              <ExternalLink href={cavaticaWebRoot}>
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
              <ExternalLink href={`${cavaticaWebRoot}/developer#token`}>
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
              Click on "<strong>Generate Token</strong>", copy and paste it into the field below and
              click Connect.
            </span>
          </div>
        </div>
        <div css="display:flex; flex-direction:column; margin-left:74px;">
          <TokenTitle>Cavatica Authentication Token:</TokenTitle>
          <TokenInput
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
            {invalidToken ? 'The provided Cavatica Token is invalid. Update and try again.' : ' '}
          </FormErrorMessage>
        </div>
      </div>
      <ModalFooter
        {...{
          handleSubmit: async () => {
            await submitCavaticaToken({
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
