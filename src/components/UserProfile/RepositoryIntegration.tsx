import React, { useEffect } from 'react';
import { connect, ConnectedProps } from 'react-redux';
import { Button, Card, Divider, Modal, notification, Row, Typography } from 'antd';

import kfFrameworkServicesLogo from 'assets/kids-first-framework-services.svg';
import dcfLogo from 'assets/logo-dcf.svg';
import { dcfWebRoot, gen3WebRoot } from 'common/injectGlobals';
import FenceAuthorizedStudies from 'components/Fence/FenceAuthorizedStudies';
import { makeCommonCardPropsReadOnly } from 'components/UserProfile/utils';
import useFenceConnections from 'hooks/useFenceConnections';
import { withApi } from 'services/api';
import {
  connectFence,
  disconnectFence,
  removeFenceConnectError,
  removeFenceDisconnectError,
} from 'store/actionCreators/fenceConnections';
import { closeModal, DispatchModal, openModal } from 'store/actions/modal';
import { Api } from 'store/apiTypes';
import { ConnectionStatus } from 'store/connectionTypes';
import { DispatchFenceConnections } from 'store/fenceConnectionsTypes';
import { AllFencesNames, FenceName } from 'store/fenceTypes';
import { RootState } from 'store/rootState';
import {
  selectFencesConnectError,
  selectFencesDisconnectError,
} from 'store/selectors/fenceConnections';
import { selectModalId } from 'store/selectors/modal';

import FenceActionButtons from './FenceActionButtons';

import './style.css';

const { Paragraph } = Typography;

const MODAL_PREFIX = 'RI_VIEW_STUDIES_';

const extractFenceNameFromModalId = (modalId: string) =>
  modalId.replace(MODAL_PREFIX, '') as FenceName;

const NEVER_CLOSES_AUTOMATICALLY = 0;

const mapStateToProps = (state: RootState) => ({
  openModalId: selectModalId(state),
  fencesConnectError: selectFencesConnectError(state),
  fencesDisconnectError: selectFencesDisconnectError(state),
});

type Dispatch = DispatchFenceConnections & DispatchModal;

const mapDispatchToProps = (dispatch: Dispatch) => ({
  openModal: (fenceName: string) => {
    dispatch(openModal(`${MODAL_PREFIX}${fenceName}`));
  },
  closeModal: (fenceName: string) => {
    dispatch(closeModal(`${MODAL_PREFIX}${fenceName}`));
  },
  connectFence: (api: Api, fenceName: FenceName) => dispatch(connectFence(api, fenceName)),
  disconnectFence: (api: Api, fenceName: FenceName) => dispatch(disconnectFence(api, fenceName)),
  removeFenceConnectError: (fenceName: FenceName) => dispatch(removeFenceConnectError(fenceName)),
  removeDisconnectError: (fenceName: FenceName) => dispatch(removeFenceDisconnectError(fenceName)),
});

const connector = connect(mapStateToProps, mapDispatchToProps);

type PropsFromRedux = ConnectedProps<typeof connector>;

type InjectedApi = {
  api: any;
};

type Props = PropsFromRedux & InjectedApi;

const RepositoryIntegration = (props: Props) => {
  const {
    openModalId,
    openModal,
    closeModal,
    api,
    connectFence,
    disconnectFence,
    fencesConnectError,
    fencesDisconnectError,
    removeFenceConnectError,
    removeDisconnectError,
  } = props;

  const { loadingFences, statuses } = useFenceConnections(api, AllFencesNames);

  const gen3HasConnectError = fencesConnectError.includes(FenceName.gen3);
  const dcfHasConnectError = fencesConnectError.includes(FenceName.dcf);

  useEffect(() => {
    const hasConnectError = fencesConnectError.length > 0;

    if (hasConnectError) {
      fencesConnectError.forEach((fenceName) =>
        notification.error({
          key: `repository_connect_error_${fenceName}`,
          message: 'Error Connecting',
          description:
            'An error occurred while connecting to the data repository.' +
            ' Please, try again or contact our support',
          duration: NEVER_CLOSES_AUTOMATICALLY,
          onClose: () => {
            removeFenceConnectError(fenceName);
          },
        }),
      );
    }
  }, [fencesConnectError, removeFenceConnectError]);

  useEffect(() => {
    const hasDisconnectError = fencesDisconnectError.length > 0;
    if (hasDisconnectError) {
      fencesDisconnectError.forEach((fenceName) =>
        notification.error({
          key: `repository_disconnect_error_${fenceName}`,
          message: 'Error Disconnecting',
          description:
            'An error occurred while disconnecting to the data repository.' +
            ' Please, try again or contact our support',
          duration: NEVER_CLOSES_AUTOMATICALLY,
          onClose: () => {
            removeDisconnectError(fenceName);
          },
        }),
      );
    }
  }, [fencesDisconnectError, removeDisconnectError]);

  const isGen3Loading = loadingFences.some((fenceName) => fenceName === FenceName.gen3);
  const isDcfLoading = loadingFences.some((fenceName) => fenceName === FenceName.dcf);

  const isGen3Connected = statuses[FenceName.gen3] === ConnectionStatus.connected;
  const isDcfConnected = statuses[FenceName.dcf] === ConnectionStatus.connected;

  const onCloseStudiesModal = () => closeModal(openModalId);

  const needToOpenFenceModal = [FenceName.gen3, FenceName.dcf].includes(
    extractFenceNameFromModalId(openModalId),
  );

  return (
    <>
      {needToOpenFenceModal && (
        <Modal
          onCancel={onCloseStudiesModal}
          visible={needToOpenFenceModal}
          title="Authorized Studies"
          footer={[
            <Button key="cancel" onClick={onCloseStudiesModal}>
              Cancel
            </Button>,
            <Button key="ok" type="primary" onClick={onCloseStudiesModal}>
              Ok
            </Button>,
          ]}
        >
          <FenceAuthorizedStudies
            fence={extractFenceNameFromModalId(openModalId)}
            onCloseModalCb={onCloseStudiesModal}
          />
        </Modal>
      )}
      <Card
        {...{
          ...makeCommonCardPropsReadOnly({
            title: ' Data Repository Integrations',
            canEdit: false,
            isProfileUpdating: false,
            onClickEditCb: null,
          }),
        }}
      >
        <Row>
          <Paragraph>
            The Kids First DRC provides the ability to integrate across different data repositories
            for pediatric research. By connecting to each integration (powered by{' '}
            <a target="_blank" rel="noopener noreferrer" href={gen3WebRoot}>
              Gen3
            </a>
            ), you will immediately have the ability to analyze the data available from these
            repositories in Cavatica through this portal. Please remember that it is your
            responsibility to follow any data use limitations with controlled access data.
          </Paragraph>
          <Divider className={'ri-divider'} />
        </Row>
        <div>
          <div className={'ii-row'}>
            <div>
              <a href={gen3WebRoot} target="_blank" rel="noopener noreferrer">
                <img
                  src={kfFrameworkServicesLogo}
                  alt="Kids First Framework Services logo"
                  height="40px"
                />
              </a>
            </div>
            <div>
              <Paragraph>
                {`Access all released Kids First controlled access data by` +
                  ` connecting your account using your NIH login credentials.`}
              </Paragraph>
            </div>
            <FenceActionButtons
              isLoading={isGen3Loading}
              hasConnectError={gen3HasConnectError}
              isConnected={isGen3Connected}
              onClickConnectButton={() =>
                isGen3Connected
                  ? disconnectFence(api, FenceName.gen3)
                  : connectFence(api, FenceName.gen3)
              }
              onClickViewStudiesButton={() => openModal(FenceName.gen3)}
            />
          </div>
          <Divider />
          <div className={'ii-row'}>
            <div>
              <a href={dcfWebRoot} target="_blank" rel="noopener noreferrer">
                <img src={dcfLogo} alt="Data Commons Framework Logo" height="40px" />
              </a>
            </div>
            <div>
              <Paragraph>
                {`Access select NCI controlled access data by connecting` +
                  ` your account using your NIH login credentials.`}
              </Paragraph>
            </div>
            <FenceActionButtons
              isLoading={isDcfLoading}
              hasConnectError={dcfHasConnectError}
              isConnected={isDcfConnected}
              onClickConnectButton={() =>
                isDcfConnected
                  ? disconnectFence(api, FenceName.dcf)
                  : connectFence(api, FenceName.dcf)
              }
              onClickViewStudiesButton={() => openModal(FenceName.dcf)}
            />
          </div>
        </div>
      </Card>
    </>
  );
};

export default withApi(connector(RepositoryIntegration));
