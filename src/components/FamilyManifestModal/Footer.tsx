/* eslint-disable react/prop-types */
import React, { FunctionComponent } from 'react';
import { Button } from 'antd';
import { DownloadOutlined } from '@ant-design/icons';
import { Sqon } from 'store/sqon';
import { TRACKING_EVENTS, trackUserInteraction } from 'services/analyticsTracking';
import { fileManifestParticipantsAndFamily } from 'services/downloadData';
import css from './FamilyManifestModal.module.css';

type sqonForDownloadParams = {
  participantIds: Array<string>;
  fileTypes: Array<string>;
  sqon: Sqon;
};

const sqonForDownload = ({ participantIds, fileTypes, sqon }: sqonForDownloadParams) =>
  sqon
    ? {
        op: 'or',
        content: [
          sqon,
          {
            op: 'and',
            content: [
              {
                op: 'in',
                content: { field: 'data_type', value: fileTypes },
              },
              {
                op: 'in',
                content: { field: 'participants.kf_id', value: participantIds },
              },
            ],
          },
        ],
      }
    : sqon;

type Column = {
  field: string;
  accessor: string;
  show: boolean;
  type: string;
  sortable: boolean;
};

type OwnProps = {
  participantIds: Array<string>;
  className: string;
  onCloseCb: () => React.MouseEventHandler<HTMLElement>;
  loading?: boolean;
  columns: Array<Column>;
  sqon: Sqon;
  checkedFileTypes: Array<string>;
};

const Footer: FunctionComponent<OwnProps> = (props) => {
  const {
    className = '',
    onCloseCb,
    loading = false,
    columns,
    participantIds,
    sqon,
    checkedFileTypes,
  } = props;

  const onClickDownload = async () => {
    const downloadSqon = sqonForDownload({
      sqon,
      fileTypes: checkedFileTypes,
      participantIds,
    });

    await fileManifestParticipantsAndFamily({
      sqon: downloadSqon,
      columns: columns,
    })();

    await trackUserInteraction({
      value: undefined,
      category: TRACKING_EVENTS.categories.fileRepo.actionsSidebar,
      action: `Download Manifest ${TRACKING_EVENTS.actions.click}`,
      label: JSON.stringify({
        sqon: downloadSqon,
        columns: [
          {
            field: 'file_name',
            accessor: 'file_name',
            show: true,
            type: 'string',
            sortable: true,
          },
        ],
      }),
    });

    onCloseCb();
  };

  return (
    <div className={className}>
      <Button onClick={onCloseCb}>Cancel</Button>
      <Button
        className={css.downloadBtn}
        icon={<DownloadOutlined />}
        type={'primary'}
        onClick={onClickDownload}
        loading={loading}
      >
        Download Manifest
      </Button>
    </div>
  );
};

export default Footer;
