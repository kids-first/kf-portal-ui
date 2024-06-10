import { useState } from 'react';
import intl from 'react-intl-universal';
import { useDispatch } from 'react-redux';
import { DownloadOutlined } from '@ant-design/icons';
import { ISyntheticSqon } from '@ferlab/ui/core/data/sqon/types';
import { Button, Checkbox, Modal, Tooltip } from 'antd';

import { ReportType } from 'services/api/reports/models';
import { fetchReport } from 'store/report/thunks';

import TooMuchFilesAlert from '../TooMuchFilesAlert';

import FilesTable from './FilesTable';

import styles from './index.module.css';

interface IDownloadFileManifestProps {
  sqon: ISyntheticSqon;
  type?: 'default' | 'primary';
  isDisabled?: boolean;
  hasTooManyFiles?: boolean;
  hasFamily?: boolean;
}

const DownloadFileManifestModal = ({
  sqon,
  type = 'default',
  isDisabled,
  hasTooManyFiles,
  hasFamily = true,
}: IDownloadFileManifestProps) => {
  const dispatch = useDispatch();

  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isFamilyChecked, setIsFamilyChecked] = useState(false);

  return (
    <>
      <Tooltip
        title={isDisabled ? intl.get('screen.dataExploration.itemSelectionTooltip') : undefined}
      >
        <Button
          icon={<DownloadOutlined />}
          onClick={() => setIsModalVisible(true)}
          type={type}
          disabled={isDisabled}
        >
          {intl.get('api.report.fileManifest.button')}
        </Button>
      </Tooltip>
      <Modal
        visible={isModalVisible}
        title={intl.get('api.report.fileManifest.title')}
        okText={intl.get('api.report.fileManifest.okText')}
        okButtonProps={{ disabled: hasTooManyFiles }}
        cancelText={intl.get('api.report.fileManifest.cancel')}
        onCancel={() => setIsModalVisible(false)}
        onOk={() => {
          dispatch(
            fetchReport({
              data: {
                name: ReportType.FILE_MANIFEST,
                fileName: isFamilyChecked ? `familyManifest` : ReportType.FILE_MANIFEST,
                sqon,
                withFamily: isFamilyChecked,
              },
              callback: () => setIsModalVisible(false),
            }),
          );
        }}
        className={styles.modal}
      >
        <p>{intl.getHTML('api.report.fileManifest.text')}</p>
        {hasFamily && (
          <Checkbox checked={isFamilyChecked} onChange={() => setIsFamilyChecked(!isFamilyChecked)}>
            {intl.get('api.report.fileManifest.textCheckbox')}
          </Checkbox>
        )}
        {hasTooManyFiles && <TooMuchFilesAlert />}
        {!hasTooManyFiles && isModalVisible && <FilesTable sqon={sqon} />}
      </Modal>
    </>
  );
};

export default DownloadFileManifestModal;
