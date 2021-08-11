/* eslint-disable react/prop-types */
import React, { FunctionComponent } from 'react';
import { connect, ConnectedProps } from 'react-redux';
import { DownloadOutlined } from '@ant-design/icons';
import { Button, Modal } from 'antd';

import { closeModal, DispatchModal, openModal } from 'store/actions/modal';
import { RootState } from 'store/rootState';
import { selectModalId } from 'store/selectors/modal';
import { Sqon } from 'store/sqon';

import FamilyManifestModalContent from '../FamilyManifestModal/FamilyManifestModalContent';

import './DownloadButton.css';

type OwnProps = {
  sqon: Sqon;
  projectId: string;
};

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

type PropsFromRedux = ConnectedProps<typeof connector>;

const connector = connect(mapStateToProps, mapDispatchToProps);

type Props = OwnProps & PropsFromRedux;

const FAMILY_MODAL_ID = 'FAMILY_MODAL_ID';

const FileManifestButton: FunctionComponent<Props> = (props) => {
  const { sqon, projectId, openModalId, openModal, closeModal } = props;

  const onCancel = () => closeModal(FAMILY_MODAL_ID);

  return (
    <>
      <Modal
        width={'75%'}
        title={'Download Manifest'}
        visible={openModalId === FAMILY_MODAL_ID}
        onCancel={onCancel}
        footer={null}
        destroyOnClose
      >
        <FamilyManifestModalContent sqon={sqon} projectId={projectId} onCloseCb={onCancel} />
      </Modal>
      <Button
        type={'primary'}
        icon={<DownloadOutlined />}
        className={'download-btn-file-repo'}
        onClick={() => {
          openModal(FAMILY_MODAL_ID);
        }}
      >
        File Manifest
      </Button>
    </>
  );
};

export default connector(FileManifestButton);
