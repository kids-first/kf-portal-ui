import * as React from 'react';
import { compose, withState } from 'recompose';
import { isValidKey } from 'services/cavatica';
import step2Screenshot from 'assets/cavaticaTokenScreenshot.png';
import { deleteSecret, setSecret } from 'services/secrets';
import { CAVATICA } from 'common/constants';
import { getUser as getCavaticaUser } from 'services/cavatica';
import { trackUserInteraction, TRACKING_EVENTS } from 'services/analyticsTracking';
import { ModalFooter, ModalWarning } from 'components/Modal/index.js';
import ExternalLink from 'uikit/ExternalLink';
import Input from 'uikit/Input';
import { Paragraph } from 'uikit/Core';
import { cavaticaWebRoot, cavaticaWebRegistrationRoot } from 'common/injectGlobals';

import { injectState } from 'freactal';
import RightArrows from 'react-icons/lib/fa/angle-double-right';

import './cavatica.css';

const enhance = compose(
  injectState,
  withState('cavaticaKey', 'setCavaticaKey', ''),
  withState('invalidToken', 'setInvalidToken', false),
);

const onCavaticaUserFailure = ({ setIntegrationToken, onFail }) => {
  setIntegrationToken(CAVATICA, null);
  deleteSecret({ service: CAVATICA });
  trackUserInteraction({
    category: TRACKING_EVENTS.categories.user.profile,
    action: TRACKING_EVENTS.actions.integration.failed,
    label: TRACKING_EVENTS.labels.cavatica,
  });
  onFail();
};

const submitCavaticaToken = async ({
  token,
  setIntegrationToken,
  setInvalidToken,
  onSuccess,
  onFail,
}) => {
  await setSecret({ service: CAVATICA, secret: token });
  try {
    const userData = await getCavaticaUser(token);
    if (userData) {
      setIntegrationToken(CAVATICA, JSON.stringify(userData));
      trackUserInteraction({
        category: TRACKING_EVENTS.categories.user.profile,
        action: TRACKING_EVENTS.actions.integration.connected,
        label: TRACKING_EVENTS.labels.cavatica,
      });
      onSuccess();
    } else {
      onCavaticaUserFailure({ setIntegrationToken, onFail });
    }
  } catch (error) {
    onCavaticaUserFailure({ setIntegrationToken, onFail });
  }
};

const NumberBullet = ({ children }) => <span className="numberBullet">{children}</span>;

const CavaticaConnectModal = ({
  state,
  effects,
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
    <div className="integrationStepsModalContent">
      <div>
        {props.withWarning && (
          <ModalWarning>
            You have not connected to your Cavatica account. Please follow the instructions below to
            connect and start copying files.
          </ModalWarning>
        )}
        <div className="stepRow">
          <div>
            <NumberBullet>1</NumberBullet>
          </div>
          <div className="stepText">
            <Paragraph>
              If you don't have one, please{' '}
              <ExternalLink href={`${cavaticaWebRegistrationRoot}`}>
                register for a Cavatica Account <RightArrows />
              </ExternalLink>
            </Paragraph>
          </div>
        </div>
        <div className="stepRow">
          <div>
            <NumberBullet>2</NumberBullet>
          </div>
          <div className="stepText">
            <Paragraph>
              You will need to retrieve your authentication token from the Cavatica{' '}
              <ExternalLink href={`${cavaticaWebRoot}/developer#token`}>
                Developer Dashboard
              </ExternalLink>
              . From the Dashboard, click on the "Auth Token" tab.
            </Paragraph>
          </div>
          <img
            className="demoImage"
            src={step2Screenshot}
            alt="Screenshot of Cavatica's Developer Den"
          />
        </div>
        <div className="stepRow">
          <div>
            <NumberBullet>3</NumberBullet>
          </div>
          <div className="stepText">
            <Paragraph>
              Click on "<strong>Generate Token</strong>", copy and paste it into the field below and
              click Connect.
            </Paragraph>
          </div>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', marginLeft: '74px' }}>
          <span className="tokenTitle">Cavatica Authentication Token:</span>
          <Input
            id="cavaticaKey"
            type="text"
            value={cavaticaKey}
            name="cavatica"
            placeholder="Cavatica Key"
            className="tokenInput"
            onChange={e => {
              setCavaticaKey(e.target.value);
              setInvalidToken(false);

              trackUserInteraction({
                category: TRACKING_EVENTS.categories.user.profile,
                action: 'Integration Credentials Updated ',
                label: TRACKING_EVENTS.labels.cavatica,
              });
            }}
          />
          <div className="formErrorMessage" id="cavaticaTokenErrorMsg">
            {invalidToken ? 'The provided Cavatica Token is invalid. Update and try again.' : ' '}
          </div>
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
          submitDisabled: invalidToken || !isValidKey(cavaticaKey),
        }}
      />
    </div>
  );
};

export default enhance(CavaticaConnectModal);
