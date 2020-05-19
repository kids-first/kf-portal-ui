/* eslint-disable react/prop-types */
import React, { Fragment, FunctionComponent } from 'react';
// @ts-ignore
import { compose } from 'recompose';
// @ts-ignore
import { injectState } from 'freactal';
import uniq from 'lodash/uniq';
// @ts-ignore
import { ColumnsState } from '@kfarranger/components/dist/DataTable';
import { familyMemberAndParticipantIds } from '../FamilyManifestModal';
import { TRACKING_EVENTS, trackUserInteraction } from 'services/analyticsTracking';
import {
  clinicalDataFamily,
  clinicalDataParticipants,
  downloadBiospecimen,
} from 'services/downloadData';
import { withApi } from 'services/api';
import FamilyManifestModal from '../FamilyManifestModal/FamilyManifestModal';

import './DownloadButton.css';
import { Menu, message, Spin } from 'antd';
import ReportsButton from 'ui/ReportsButton';
import { Sqon, ModalStateEffects } from '../../types';

type Column = {
  Header: string;
  accessor: string;
  canChangeShow: boolean;
  extendedDisplayValues: any;
  extendedType: string;
  field: string;
  jsonPath: any;
  query: any;
  show: boolean;
  sortable: boolean;
  type: string;
  [key: string]: any;
};

type DownloaderParams = {
  api?: Function;
  sqon: Sqon;
  columns: Column[];
};

type StateProp = {
  type: string;
  keyField: string;
  defaultSorted: any;
  columns: Column[];
  [key: string]: any;
};

type Props = {
  sqon: Sqon;
  api: Function;
  projectId: string;
  effects: ModalStateEffects;
};

type ColumnStateRenderProps = {
  state: StateProp;
  loading: boolean;
};

const trackDownload = async (label: string) =>
  // @ts-ignore
  await trackUserInteraction({
    category: TRACKING_EVENTS.categories.fileRepo.actionsSidebar,
    action: TRACKING_EVENTS.actions.download.report,
    label,
  });

const participantDownloader = async ({ api, sqon, columns }: DownloaderParams) => {
  await trackDownload('Clinical (Participant)');
  const isFileRepo = true;
  const { participantIds } = await familyMemberAndParticipantIds({
    api,
    sqon,
    isFileRepo,
  });
  const downloadConfig = {
    sqon: {
      op: 'in',
      content: {
        field: 'participants.kf_id',
        value: participantIds,
      },
    },
    columns,
    isFileRepo: isFileRepo,
  };
  return clinicalDataParticipants(downloadConfig);
};

const familyDownloader = async ({ api, sqon, columns }: DownloaderParams) => {
  await trackDownload('Clinical (Participant and family)');
  const isFileRepo = true;
  const { familyMemberIds, participantIds } = await familyMemberAndParticipantIds({
    api,
    sqon,
    isFileRepo,
  });
  const downloadConfig = {
    sqon: {
      op: 'in',
      content: {
        field: 'participants.kf_id',
        value: uniq([...familyMemberIds, ...participantIds]),
      },
    },
    columns,
    isFileRepo,
  };
  return clinicalDataFamily(downloadConfig);
};

const biospecimenDownloader = async ({ sqon, columns }: DownloaderParams) => {
  await trackDownload('Biospecimen');
  const downloadConfig = { sqon, columns, isFileRepo: true };
  return downloadBiospecimen(downloadConfig);
};

const isFamilyDownloadAvailable = async (api: Function, sqon: Sqon) => {
  const { familyMembersWithoutParticipantIds } = await familyMemberAndParticipantIds({
    api,
    sqon,
    isFileRepo: true,
  });
  return (familyMembersWithoutParticipantIds || []).length > 0;
};

const DownloadButton: FunctionComponent<Props> = (props) => {
  const {
    api,
    sqon,
    projectId,
    effects: { setModal },
  } = props;

  return (
    <ColumnsState
      projectId={projectId}
      graphqlField="participant"
      render={({ state: { columns }, loading }: ColumnStateRenderProps) => {
        if (loading) {
          return (
            <div className={'wrapper-spinner'}>
              <Spin />
            </div>
          );
        }

        const generatorMenuItems = () => [
          <Menu.Item key="clinicalData">{'Clinical Data: Participants only'}</Menu.Item>,
          <Menu.Item key="familyClinicalData">
            {'Clinical Data: Participant & Family Members'}
          </Menu.Item>,
          <Menu.Item key="biospecimenData">{'Biospecimen Data'}</Menu.Item>,
          <Menu.Item key="fileManifest">{'File Manifest'}</Menu.Item>,
        ];

        const download = async (reportName: string, sqon: Sqon) => {
          const reportMap: { [key: string]: Promise<() => void> } = {
            clinicalData: participantDownloader({ api, sqon, columns }),
            familyClinicalData: familyDownloader({
              api,
              sqon,
              columns,
            }),
            biospecimenData: biospecimenDownloader({ api, sqon, columns }),
          };

          const reportFn = reportMap[reportName];
          let hideLoadingMessage;
          try {
            if (reportName === 'fileManifest') {
              return () => {
                setModal({
                  title: 'Download Manifest',
                  component: <FamilyManifestModal sqon={sqon} projectId={projectId} />,
                });
              };
            } else if (reportName === 'familyClinicalData') {
              hideLoadingMessage = message.loading('Please wait while we check availability', 0);
              const isAvailable = await isFamilyDownloadAvailable(api, sqon);
              hideLoadingMessage();
              if (!isAvailable) {
                message.warning('No report available for additional family members.', 3.5);
                return;
              }
            }

            hideLoadingMessage = message.loading('Please wait while we generate your report', 0);
            (await reportFn)();
          } finally {
            hideLoadingMessage && hideLoadingMessage();
          }
        };

        return (
          <Fragment>
            <ReportsButton
              sqon={sqon}
              generatorMenuItems={generatorMenuItems}
              action={download}
              className={'download-btn-file-repo'}
            />
          </Fragment>
        );
      }}
    />
  );
};

export default compose(withApi, injectState)(DownloadButton);
