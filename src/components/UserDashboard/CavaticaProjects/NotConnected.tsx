import React, { FunctionComponent } from 'react';
import { connect, ConnectedProps } from 'react-redux';
import { ApiOutlined, RightOutlined } from '@ant-design/icons';
import { Button } from 'antd';

import CavaticaConnectModal from 'components/cavatica/CavaticaConnectModal';
import Cavatica from 'icons/Cavatica';
import { closeModal, DispatchModal, openModal } from 'store/actions/modal';
import { RootState } from 'store/rootState';
import { selectModalId } from 'store/selectors/modal';

import AccessGate from '../../AccessGate';
import Info from '../Info';

const mapStateToProps = (state: RootState) => ({
  openModalId: selectModalId(state),
});

const mapDispatchToProps = (dispatch: DispatchModal) => ({
  openModal: (id: string) => {
    dispatch(openModal(id));
  },
  closeModal: (id: string) => {
    dispatch(closeModal(id));
  },
});

const connector = connect(mapStateToProps, mapDispatchToProps);

const CAVATICA_CONNECT_MODAL_ID = 'CAVATICA_CONNECT_MODAL_ID';

type PropsFromRedux = ConnectedProps<typeof connector>;

const NotConnected: FunctionComponent<PropsFromRedux> = ({
  openModalId,
  openModal,
  closeModal,
}) => {
  const showConnectModal = openModalId === CAVATICA_CONNECT_MODAL_ID;
  const onClose = () => closeModal(CAVATICA_CONNECT_MODAL_ID);

  return (
    <>
      {showConnectModal && (
        <CavaticaConnectModal isVisible onComplete={onClose} onCancelCB={onClose} />
      )}

      <AccessGate
        mt={'40px'}
        Icon={Cavatica}
        title="Collaborative Analysis"
        detail="To analyze Kids First data on the cloud, connect to Cavatica."
      >
        <Button
          type={'primary'}
          icon={<ApiOutlined />}
          onClick={() => {
            openModal(CAVATICA_CONNECT_MODAL_ID);
          }}
        >
          CONNECT
          <RightOutlined />
        </Button>
      </AccessGate>
      <Info
        link={{
          url: 'https://kidsfirstdrc.org/support/analyze-data/',
          text: 'CAVATICA compute cloud platform',
        }}
      />
    </>
  );
};

export default connector(NotConnected);
