import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { ApiOutlined, DisconnectOutlined, EditOutlined } from '@ant-design/icons';
import { Button, Card, notification, Row, Typography } from 'antd';

import cavaticaLogo from 'assets/logo-cavatica.svg';
import { cavaticaWebRoot } from 'common/injectGlobals';
import CavaticaConnectModal from 'components/cavatica/CavaticaConnectModal';
import { makeCommonCardPropsReadOnly } from 'components/UserProfile/utils';
import useCavatica from 'hooks/useCavatica';
import { disconnect } from 'store/actionCreators/cavatica';
import { closeModal, openModal } from 'store/actions/modal';
import { RootState } from 'store/rootState';
import { selectModalId } from 'store/selectors/modal';

import { CAVATICA_INTEGRATION_MODAL_ID } from './constants';

import './style.css';

const { Paragraph } = Typography;

const NOTIFICATION_DURATION_IN_SEC = 10;

const SHOW_CAVATICA = false;

const ApplicationIntegration = () => {
  const dispatch = useDispatch();

  const { isConnected, isCheckingIfConnected } = useCavatica();

  const modalId = useSelector((state: RootState) => selectModalId(state));

  const currentModalIsCavaticaConnect = modalId === CAVATICA_INTEGRATION_MODAL_ID;
  const openCavaticaConnectModal = () => dispatch(openModal(CAVATICA_INTEGRATION_MODAL_ID));
  const closeCavaticaConnectModal = () => dispatch(closeModal(CAVATICA_INTEGRATION_MODAL_ID));
  const onCompleteCavaticaConnect = () => {
    dispatch(closeModal(CAVATICA_INTEGRATION_MODAL_ID));
    notification.success({
      message: 'Success',
      description: `Successfully connected to Cavatica.`,
      duration: NOTIFICATION_DURATION_IN_SEC,
    });
  };

  return (
    <>
      {currentModalIsCavaticaConnect && SHOW_CAVATICA && (
        <CavaticaConnectModal
          isVisible
          onComplete={onCompleteCavaticaConnect}
          onCancelCB={closeCavaticaConnectModal}
        />
      )}
      <Card
        {...{
          ...makeCommonCardPropsReadOnly({
            title: 'Application Integrations',
            canEdit: false,
            isProfileUpdating: false,
            onClickEditCb: null,
          }),
        }}
      >
        <Row>
          <div className={'ii-row'}>
            <div>
              <img src={cavaticaLogo} alt="Cavatica Logo" height="45px" />
            </div>
            <div>
              <Paragraph>
                {
                  'Analyze data quickly by connecting your account to the cloud compute environment,  '
                }
                <a target="_blank" rel="noopener noreferrer" href={cavaticaWebRoot}>
                  Cavatica
                </a>
                .
              </Paragraph>
            </div>
            <div className={'ii-button-container'}>
              <Button
                type={'primary'}
                size={'small'}
                shape="round"
                className={'ii-button-common ii-connect-button'}
                loading={isCheckingIfConnected}
                disabled={isCheckingIfConnected}
                danger={isConnected}
                onClick={isConnected ? () => dispatch(disconnect()) : openCavaticaConnectModal}
                icon={isConnected ? <DisconnectOutlined /> : <ApiOutlined />}
              >
                {isConnected ? 'Disconnect' : 'Connect'}
              </Button>
              {isConnected && (
                <Button
                  shape="round"
                  className={'ii-button-common ii-button-action'}
                  onClick={openCavaticaConnectModal}
                  icon={<EditOutlined />}
                  size={'small'}
                >
                  Settings
                </Button>
              )}
            </div>
          </div>
        </Row>
      </Card>
    </>
  );
};

export default ApplicationIntegration;
