/* eslint-disable react/prop-types */
import React, { FunctionComponent } from 'react';
import UploadIdsModal from 'components/UploadIdsModal';
import { Button } from 'antd';
import { CloudUploadOutlined } from '@ant-design/icons';
import './aggregationSideBar.css';
import { EsIndex, ProjectId } from 'store/esTypes';
import { setSqonArrangerCB } from 'store/sqon';
import { connect, ConnectedProps } from 'react-redux';
import { selectModalId } from 'store/selectors/modal';
import { closeModal, openModal, DispatchModal } from 'store/actions/modal';
import { RootState } from 'store/rootState';

type OwnProps = {
  graphqlField: string;
  whitelist: Array<string>;
  uploadableFields: Array<string>;
  setSQON: setSqonArrangerCB;
  index: EsIndex;
  matchboxPlaceholderText: string;
  projectId: ProjectId;
  searchFields?: string;
  id: string;
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

const connector = connect(mapStateToProps, mapDispatchToProps);

type PropsFromRedux = ConnectedProps<typeof connector>;

type Props = OwnProps & PropsFromRedux;

const generateModalId = (id: string) => `UPLOAD_IDS_${id}`;

const UploadIdsButton: FunctionComponent<Props> = ({
  searchFields,
  matchboxPlaceholderText,
  setSQON,
  graphqlField,
  index,
  projectId,
  uploadableFields,
  whitelist,
  openModalId,
  closeModal,
  openModal,
  id,
}) => (
  <>
    <UploadIdsModal
      placeholderText={matchboxPlaceholderText}
      {...{
        graphqlField,
        index,
        projectId,
        uploadableFields,
        whitelist,
        setSQON,
        searchFields,
      }}
      isVisible={openModalId === generateModalId(id)}
      closeModal={() => closeModal(generateModalId(id))}
    />
    <div className={'upload-btn-container'}>
      <CloudUploadOutlined className={'upload-icon ant-btn-link'} />
      <Button size={'small'} type="link" onClick={() => openModal(generateModalId(id))}>
        {'upload your list of ids'}
      </Button>
    </div>
  </>
);

export default connector(UploadIdsButton);
