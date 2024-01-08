import { useEffect, useState } from 'react';
import intl from 'react-intl-universal';
import { useDispatch } from 'react-redux';
import { ApiOutlined, RocketOutlined } from '@ant-design/icons';
import { IFenceService } from '@ferlab/ui/core/components/Widgets/AuthorizedStudies';
import FencesAuthentificationModal from '@ferlab/ui/core/components/Widgets/AuthorizedStudies/FencesAuthentificationModal';
import GridCard from '@ferlab/ui/core/view/v2/GridCard';
import { Alert, Button, Space, Typography } from 'antd';
import { isNotebookStatusInProgress, isNotebookStatusLaunched } from 'helpers/notebook';
import CardHeader from 'views/Dashboard/components/CardHeader';
import { DashboardCardProps } from 'views/Dashboard/components/DashboardCards';

import { FENCE_NAMES } from 'common/fenceTypes';
import ZeppelinImg from 'components/assets/appache-zeppelin.png';
import KidsFirstLoginIcon from 'components/Icons/KidsFirstLoginIcon';
import NciIcon from 'components/Icons/NciIcon';
import OpenInNewIcon from 'components/Icons/OpenInIcon';
import useInterval from 'hooks/useInterval';
import { TUserGroups } from 'services/api/user/models';
import { useAtLeastOneFenceConnected, useFenceAuthentification } from 'store/fences';
import { fenceDisconnection, fenceOpenAuhentificationTab } from 'store/fences/thunks';
import { useNotebook } from 'store/notebook';
import { getNotebookClusterStatus, startNotebookCluster } from 'store/notebook/thunks';
import { useUser } from 'store/user';

import styles from './index.module.scss';
const { Text } = Typography;

const REFRESH_INTERVAL = 30000;

const Notebook = ({ id, key, className = '' }: DashboardCardProps) => {
  const dispatch = useDispatch();
  const gen3 = useFenceAuthentification(FENCE_NAMES.gen3);
  const dcf = useFenceAuthentification(FENCE_NAMES.dcf);
  const services: IFenceService[] = [
    {
      fence: FENCE_NAMES.gen3,
      name: 'Kids First Framework Services',
      icon: <KidsFirstLoginIcon width={45} height={45} />,
      onConnectToFence: () => {
        dispatch(fenceOpenAuhentificationTab(FENCE_NAMES.gen3));
      },
      onDisconnectFromFence: () => {
        dispatch(fenceDisconnection(FENCE_NAMES.gen3));
      },
    },
    {
      fence: FENCE_NAMES.dcf,
      name: 'NCI CRDC Framework Services',
      icon: <NciIcon width={45} height={45} />,
      onConnectToFence: () => {
        dispatch(fenceOpenAuhentificationTab(FENCE_NAMES.dcf));
      },
      onDisconnectFromFence: () => {
        dispatch(fenceDisconnection(FENCE_NAMES.dcf));
      },
    },
  ];
  const [isFenceModalAuthentificationOpen, setIsFenceModalAuthentificationOpen] =
    useState<boolean>(false);
  const { url, isLoading, error, status } = useNotebook();
  const { groups } = useUser();
  const onCloseFenceAuthentificationModal = () => {
    setIsFenceModalAuthentificationOpen(false);
    if (hasAtLeastOneAuthentificatedFence) {
      handleStartNotebookCluster();
    }
  };

  const hasAtLeastOneAuthentificatedFence = useAtLeastOneFenceConnected();

  const isAllowed = groups.includes(TUserGroups.INVESTIGATOR);
  const isProcessing = (isLoading || isNotebookStatusInProgress(status)) && !error;

  const handleStartNotebookCluster = () =>
    dispatch(
      startNotebookCluster({
        onSuccess: () => dispatch(getNotebookClusterStatus()),
      }),
    );

  useInterval(
    () => {
      dispatch(getNotebookClusterStatus());
    },
    // Delay in milliseconds or null to stop it
    isProcessing ? REFRESH_INTERVAL : null,
  );

  useEffect(() => {
    // can check status
    if (isAllowed && !error) {
      dispatch(getNotebookClusterStatus());
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <>
      <FencesAuthentificationModal
        open={isFenceModalAuthentificationOpen}
        onCancel={onCloseFenceAuthentificationModal}
        onOk={onCloseFenceAuthentificationModal}
        fences={[gen3, dcf]}
        services={services}
      />
      <GridCard
        theme="shade"
        wrapperClassName={className}
        title={
          <CardHeader
            id={id}
            key={key}
            title={intl.get('screen.dashboard.cards.notebook.title')}
            withHandle
          />
        }
        content={
          <div className={styles.wrapper}>
            <Space className={styles.textCentered} align="center" direction="vertical" size={16}>
              <div>
                <img src={ZeppelinImg} alt="Appache-Zeppelin-Logo" width={105} />
              </div>
              <Text>{intl.getHTML('screen.dashboard.cards.notebook.description')}</Text>
              {!hasAtLeastOneAuthentificatedFence && (
                <Button
                  type="primary"
                  size="small"
                  icon={<ApiOutlined />}
                  disabled={!isAllowed}
                  onClick={() => {
                    setIsFenceModalAuthentificationOpen(true);
                  }}
                >
                  {intl.get('global.connect')}
                </Button>
              )}

              {hasAtLeastOneAuthentificatedFence && !url && (
                <Button
                  loading={isProcessing}
                  disabled={!isAllowed}
                  type="primary"
                  size="small"
                  icon={<RocketOutlined width={11} height={14} />}
                  onClick={() => handleStartNotebookCluster()}
                >
                  {intl.get('screen.dashboard.cards.notebook.launch')}
                </Button>
              )}

              {hasAtLeastOneAuthentificatedFence && url && isNotebookStatusLaunched(status) && (
                <Button type="primary" size="small" href={url} target="_blank">
                  <span>{intl.get('screen.dashboard.cards.notebook.open')}</span>
                  <OpenInNewIcon width={12.5} height={12.5} />
                </Button>
              )}
            </Space>

            <Space className={styles.message} size={8} direction="vertical">
              {isProcessing && (
                <Text className={styles.message} disabled>
                  {intl.get('screen.dashboard.cards.notebook.wait')}
                </Text>
              )}

              {!isAllowed && (
                <Text className={styles.message} disabled>
                  {intl.get('screen.dashboard.cards.notebook.notAllowed')}
                </Text>
              )}
              {error && (
                <Alert
                  type="error"
                  message={<>{intl.getHTML('screen.dashboard.cards.notebook.contactSupport')}</>}
                />
              )}
            </Space>
          </div>
        }
      />
    </>
  );
};

export default Notebook;
