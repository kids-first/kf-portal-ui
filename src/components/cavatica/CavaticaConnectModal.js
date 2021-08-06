import React, { useState } from 'react';
import RightArrows from 'react-icons/lib/fa/angle-double-right';
import { useDispatch } from 'react-redux';
import { Button, Modal, notification } from 'antd';
import PropTypes from 'prop-types';

import step2Screenshot from 'assets/cavaticaTokenScreenshot.png';
import { cavaticaWebRegistrationRoot, cavaticaWebRoot } from 'common/injectGlobals';
import { ModalWarning } from 'components/Modal/index.js';
import { TRACKING_EVENTS, trackUserInteraction } from 'services/analyticsTracking';
import { Paragraph } from 'uikit/Core';
import ExternalLink from 'uikit/ExternalLink';
import Input from 'uikit/Input';

import { submitToken } from '../../store/actionCreators/cavatica';

import './cavatica.css';

const NumberBullet = ({ children }) => <span className="numberBullet">{children}</span>;

NumberBullet.propTypes = {
  children: PropTypes.oneOfType([PropTypes.number, PropTypes.string]).isRequired,
};

const CavaticaConnectModal = ({ withWarning, onComplete, isVisible, onCancelCB = () => {} }) => {
  const dispatch = useDispatch();

  const [isLoading, setIsLoading] = useState(false);
  const [cavaticaKey, setCavaticaKey] = useState('');
  const [invalidToken, setInvalidToken] = useState(false);

  const onSubmitFail = () => {
    setInvalidToken(true);
    notification.error({
      message: 'Cavatica',
      description: 'Could not connect to Cavatica, please try again',
      duration: 10,
    });
  };

  return (
    <Modal
      destroyOnClose
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
          disabled={invalidToken || !cavaticaKey}
          onClick={async () => {
            setIsLoading(true);
            await dispatch(submitToken(cavaticaKey, onComplete, onSubmitFail));
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
              onChange={async (e) => {
                setCavaticaKey(e.target.value);
                setInvalidToken(false);

                await trackUserInteraction({
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

CavaticaConnectModal.propTypes = {
  withWarning: PropTypes.bool,
  onComplete: PropTypes.func.isRequired,
  isVisible: PropTypes.bool.isRequired,
  onCancelCB: PropTypes.func.isRequired,
};

export default CavaticaConnectModal;
