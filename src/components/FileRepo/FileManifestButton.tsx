/* eslint-disable react/prop-types */
import React, { FunctionComponent } from 'react';
// @ts-ignore
import { compose } from 'recompose';
// @ts-ignore
import { injectState } from 'freactal';
import './DownloadButton.css';
import { Button } from 'antd';
import { Sqon } from 'store/sqon';
import { ModalStateEffects } from 'store/freactalModalState';
import { DownloadOutlined } from '@ant-design/icons';
import FamilyManifestModal from '../FamilyManifestModal/FamilyManifestModal';

type Props = {
  sqon: Sqon;
  projectId: string;
  effects: ModalStateEffects;
};

const FileManifestButton: FunctionComponent<Props> = (props) => {
  const {
    sqon,
    projectId,
    effects: { setModal },
  } = props;

  return (
    <Button
      type={'primary'}
      icon={<DownloadOutlined />}
      className={'download-btn-file-repo'}
      onClick={() => {
        setModal({
          title: 'Download Manifest',
          component: <FamilyManifestModal sqon={sqon} projectId={projectId} />,
        });
      }}
    >
      File Manifest
    </Button>
  );
};

export default compose(injectState)(FileManifestButton);
