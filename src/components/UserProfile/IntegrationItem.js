/* eslint-disable react/prop-types */
import React, { Fragment } from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router';
import { ApiOutlined, DisconnectOutlined } from '@ant-design/icons';
import { Button, Modal, Typography } from 'antd';
import PropTypes from 'prop-types';
import { compose, setPropTypes } from 'recompose';

import { closeModal, openModal } from 'store/actions/modal';
import { selectModalId } from 'store/selectors/modal';

import CavaticaConnectModal from '../cavatica/CavaticaConnectModal';
import FenceAuthorizedStudies from '../Fence/FenceAuthorizedStudies';

import { CAVATICA_INTEGRATION_MODAL_ID } from './constants';
import IntegrationItemErrorRow from './IntegrationItemErrorRow';

import './style.css';

const { Paragraph } = Typography;

const hasAtLeastOneError = (...potentialErrors) => potentialErrors.some((e) => Boolean(e));

const generateLabelForConnect = ({ loading, connected }) => {
  if (loading) {
    return '';
  } else if (connected) {
    return 'Disconnect';
  }
  return 'Connect';
};

const IntegrationItem = (props) => {
  const {
    logo,
    loading,
    description,
    errorConnect,
    errorDisconnect,
    onClickConnectCb,
    onClickDisconnectCb,
    onClickResetErrorsCb,
    history,
    connected,
    actionButtonWhenConnected,
    openModal,
    fence,
    openModalId,
    closeModal,
  } = props;

  const { label, icon, modalId } = actionButtonWhenConnected;

  const isCavaticaModal = modalId === CAVATICA_INTEGRATION_MODAL_ID;
  const isItemModalToBeOpen = openModalId === modalId;
  const isFenceModalToBeOpen = !isCavaticaModal && isItemModalToBeOpen;
  const showCavaticaModal = isCavaticaModal && isItemModalToBeOpen;

  const onClose = () => closeModal(modalId);

  return (
    <Fragment key={fence}>
      {hasAtLeastOneError(errorConnect, errorDisconnect) ? (
        <IntegrationItemErrorRow
          errorConnect={errorConnect}
          errorDisconnect={errorDisconnect}
          onClickConnectCb={onClickConnectCb}
          onClickDisconnectCb={onClickDisconnectCb}
          onClickResetErrorsCb={onClickResetErrorsCb}
          history={history}
        />
      ) : (
        <>
          {showCavaticaModal && (
            <CavaticaConnectModal
              isVisible={showCavaticaModal}
              onComplete={onClose}
              onCancelCB={onClose}
            />
          )}
          {!isCavaticaModal && (
            <Modal
              onCancel={onClose}
              visible={isFenceModalToBeOpen}
              title="Authorized Studies"
              footer={[
                <Button key="cancel" onClick={onClose}>
                  Cancel
                </Button>,
                <Button key="ok" type="primary" onClick={onClose}>
                  Ok
                </Button>,
              ]}
            >
              <FenceAuthorizedStudies fence={fence} onCloseModalCb={onClose} />
            </Modal>
          )}
          <div className={'ii-row'}>
            <div>{logo}</div>
            <div>
              <Paragraph>{description}</Paragraph>
            </div>
            <div className={'ii-button-container'}>
              <Button
                size={'small'}
                shape="round"
                className={'ii-button-common ii-connect-button'}
                loading={loading}
                type={connected && !loading ? 'danger' : 'primary'}
                onClick={connected ? onClickDisconnectCb : onClickConnectCb}
                icon={connected ? <DisconnectOutlined /> : <ApiOutlined />}
              >
                {generateLabelForConnect({ loading, connected })}
              </Button>
              {connected && (
                <Button
                  shape="round"
                  className={'ii-button-common ii-button-action'}
                  onClick={() => {
                    openModal(modalId);
                  }}
                  icon={icon}
                  size={'small'}
                >
                  {label}
                </Button>
              )}
            </div>
          </div>
        </>
      )}
    </Fragment>
  );
};

const Enhanced = compose(
  withRouter,
  setPropTypes({
    logo: PropTypes.node.isRequired,
    description: PropTypes.oneOfType([PropTypes.string, PropTypes.node]).isRequired,
    connected: PropTypes.bool,
    loading: PropTypes.bool.isRequired,
    actionButtonWhenConnected: PropTypes.shape({
      modalId: PropTypes.string.isRequired,
      icon: PropTypes.element.isRequired,
      label: PropTypes.string.isRequired,
    }).isRequired,
    onClickDisconnectCb: PropTypes.func.isRequired,
    onClickConnectCb: PropTypes.func.isRequired,
    errorConnect: PropTypes.object,
    errorDisconnect: PropTypes.object,
    history: PropTypes.object.isRequired,
    onClickResetErrorsCb: PropTypes.func.isRequired,
    fence: PropTypes.string,
    openModalId: PropTypes.string,
  }),
)(IntegrationItem);

const mapStateToProps = (state) => ({
  openModalId: selectModalId(state),
});

const mapDispatchToProps = (dispatch) => ({
  openModal: (id) => {
    dispatch(openModal(id));
  },
  closeModal: (id) => {
    dispatch(closeModal(id));
  },
});

export default connect(mapStateToProps, mapDispatchToProps)(Enhanced);
