import { useState } from 'react';
import intl from 'react-intl-universal';
import { useDispatch } from 'react-redux';
import { DownloadOutlined } from '@ant-design/icons';
import ExternalLink from '@ferlab/ui/core/components/ExternalLink';
import { ISyntheticSqon } from '@ferlab/ui/core/data/sqon/types';
import { Button, Checkbox, Modal } from 'antd';
import EnvVariables from 'helpers/EnvVariables';

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
}

const DownloadRequestAccessModal = ({
  sqon,
  type = 'default',
  isDisabled,
  hasTooManyFiles: hasTooManyFiles,
}: IDownloadFileManifestProps) => {
  const dispatch = useDispatch();

  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isFamilyChecked, setIsFamilyChecked] = useState(false);

  // TODO: to replace when file access are enable in KF
  const docHref = `${EnvVariables.configFor(
    'CQDG_DOCUMENTATION',
  )}/en/acces-donnees/demande-acces-donnees`;

  return (
    <>
      <Button
        icon={<DownloadOutlined />}
        onClick={() => setIsModalVisible(true)}
        type={type}
        disabled={isDisabled}
      >
        {intl.get('api.report.requestAccess.button')}
      </Button>
      <Modal
        open={isModalVisible}
        title={intl.get('api.report.requestAccess.title')}
        okText={intl.get('api.report.requestAccess.okText')}
        okButtonProps={{ disabled: hasTooManyFiles }}
        cancelText={intl.get('api.report.requestAccess.cancel')}
        onCancel={() => setIsModalVisible(false)}
        onOk={() => {
          dispatch(
            fetchReport({
              data: {
                name: ReportType.FILE_REQUEST_ACCESS,
                sqon,
                withFamily: isFamilyChecked,
              },
              callback: () => setIsModalVisible(false),
            }),
          );
        }}
        className={styles.modal}
      >
        <div>
          {intl.get('api.report.requestAccess.text')}
          <ExternalLink href={docHref}>
            {intl.get('api.report.requestAccess.textLink')}
          </ExternalLink>
          .
        </div>
        <br />
        <Checkbox checked={isFamilyChecked} onChange={() => setIsFamilyChecked(!isFamilyChecked)}>
          {intl.get('api.report.requestAccess.textCheckbox')}
        </Checkbox>
        {hasTooManyFiles && <TooMuchFilesAlert />}
        {!hasTooManyFiles && isModalVisible && <FilesTable sqon={sqon} />}
      </Modal>
    </>
  );
};

export default DownloadRequestAccessModal;
