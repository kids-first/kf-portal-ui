//FIXME slowly removing freactal (effects.setModal, ...) CavaticaConnectModal is used elsewhere and it's too complicated to do in 1 PR
//FIXME use redux store redux + clean
import React, { useState } from 'react';
import RightArrows from 'react-icons/lib/fa/angle-double-right';
import { Button, Modal, notification } from 'antd';
import { injectState } from 'freactal';
import PropTypes from 'prop-types';
import { compose } from 'recompose';

import step2Screenshot from 'assets/cavaticaTokenScreenshot.png';
import { CAVATICA } from 'common/constants';
import { cavaticaWebRegistrationRoot, cavaticaWebRoot } from 'common/injectGlobals';
import { ModalWarning } from 'components/Modal/index.js';
import { TRACKING_EVENTS, trackUserInteraction } from 'services/analyticsTracking';
import { isValidKey } from 'services/cavatica';
import { getUser as getCavaticaUser } from 'services/cavatica';
import { deleteSecret, setSecret } from 'services/secrets';
import { Paragraph } from 'uikit/Core';
import ExternalLink from 'uikit/ExternalLink';
import Input from 'uikit/Input';

import './cavatica.css';

const enhance = compose(injectState);

const onCavaticaUserFailure = async ({ setIntegrationToken, onFail }) => {
  setIntegrationToken(CAVATICA, null);
  await deleteSecret({ service: CAVATICA });
  await trackUserInteraction({
    category: TRACKING_EVENTS.categories.user.profile,
    action: TRACKING_EVENTS.actions.integration.failed,
    label: TRACKING_EVENTS.labels.cavatica,
  });
  onFail();
};

const submitCavaticaToken = async ({ token, setIntegrationToken, onSuccess, onFail }) => {
  await setSecret({ service: CAVATICA, secret: token });
  try {
    const userData = await getCavaticaUser(token);
    if (userData) {
      setIntegrationToken(CAVATICA, JSON.stringify(userData));
      await trackUserInteraction({
        category: TRACKING_EVENTS.categories.user.profile,
        action: TRACKING_EVENTS.actions.integration.connected,
        label: TRACKING_EVENTS.labels.cavatica,
      });
      onSuccess();
    } else {
      await onCavaticaUserFailure({ setIntegrationToken, onFail });
    }
  } catch (error) {
    await onCavaticaUserFailure({ setIntegrationToken, onFail });
  }
};

const NumberBullet = ({ children }) => <span className="numberBullet">{children}</span>;

NumberBullet.propTypes = {
  children: PropTypes.oneOfType([PropTypes.number, PropTypes.string]).isRequired,
};

const CavaticaConnectModal2 = ({
  effects,
  withWarning,
  onComplete,
  isVisible,
  onCancelCB = () => {},
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const [cavaticaKey, setCavaticaKey] = useState('');
  const [invalidToken, setInvalidToken] = useState(false);

  return (
    <Modal
      width={'65%'}
      visible={isVisible}
      title={'How to Connect to Cavatica'}
      onCancel={onCancelCB}
      footer={[
        <Button key="cancel" onClick={onCancelCB}>
          Cancel
        </Button>,
        <Button
          key="connect"
          type="primary"
          loading={isLoading}
          disabled={invalidToken || !isValidKey(cavaticaKey)}
          onClick={async () => {
            setIsLoading(true);
            await submitCavaticaToken({
              token: cavaticaKey,
              setIntegrationToken: effects.setIntegrationToken,
              onSuccess: onComplete,
              onFail: () => {
                setInvalidToken(true);
                notification.error({
                  message: 'Cavatica',
                  description: 'Could not connect to Cavatica, please try again',
                  duration: 10,
                });
              },
            });
            setIsLoading(false);
            onCancelCB();
          }}
        >
          Connect
        </Button>,
      ]}
    >
      <div className="integrationStepsModalContent stepsWrapper">
        <div>
          {withWarning && (
            <ModalWarning>
              You have not connected to your Cavatica account. Please follow the instructions below
              to connect and start copying files.
            </ModalWarning>
          )}
          <div className="stepRow">
            <div>
              <NumberBullet>1</NumberBullet>
            </div>
            <div className="stepText">
              <Paragraph>
                {"If you don't have one, please "}
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
                <ExternalLink href={`${cavaticaWebRoot}developer#token`}>
                  Developer Dashboard
                </ExternalLink>
                {'. From the Dashboard, click on the "Auth Token" tab.'}
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
                Click on &quot;<strong>Generate Token</strong>&quot;, copy and paste it into the
                field below and click Connect.
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
              onChange={(e) => {
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
      </div>
    </Modal>
  );
};

CavaticaConnectModal2.propTypes = {
  effects: PropTypes.object.isRequired,
  withWarning: PropTypes.bool,
  onComplete: PropTypes.func.isRequired,
  isVisible: PropTypes.bool.isRequired,
  onCancelCB: PropTypes.func.isRequired,
};

export default enhance(CavaticaConnectModal2);
//TODO naming + test onComplete + warning
