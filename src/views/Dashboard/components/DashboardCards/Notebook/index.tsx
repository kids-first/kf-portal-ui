import GridCard from '@ferlab/ui/core/view/v2/GridCard';
import { Space, Typography, Button, Alert } from 'antd';
import intl from 'react-intl-universal';
import { DashboardCardProps } from 'views/Dashboard/components/DashboardCards';
import CardHeader from 'views/Dashboard/components/CardHeader';
import { useDispatch } from 'react-redux';

import ZeppelinImg from 'components/assets/appache-zeppelin.png';
import styles from './index.module.scss';
import { useNotebook } from 'store/notebook';
import { useEffect } from 'react';
import { startNotebookCluster, getNotebookClusterStatus } from 'store/notebook/thunks';
import { useUser } from 'store/user';
import { TUserGroups } from 'services/api/user/models';
import useInterval from 'hooks/useInterval';
import { isNotebookStatusInProgress, isNotebookStatusLaunched } from 'helpers/notebook';
import { useFenceConnection } from 'store/fenceConnection';
import { hasOneFenceConnected } from 'helpers/fence';
import { fenceConnectionActions } from 'store/fenceConnection/slice';
import { ApiOutlined, RocketOutlined } from '@ant-design/icons';
import OpenInNewIcon from 'components/Icons/OpenInIcon';
const { Text } = Typography;

const Notebook = ({ id, className = '' }: DashboardCardProps) => {
  const dispatch = useDispatch();
  const { url, isLoading, error, status } = useNotebook();
  const { groups } = useUser();
  const { connectionStatus } = useFenceConnection();

  const isConnectedToFences = hasOneFenceConnected(connectionStatus) || true;

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
    isProcessing ? 2000 : null,
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
      <GridCard
        theme="shade"
        wrapperClassName={className}
        title={
          <CardHeader
            id={id}
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
              {!isConnectedToFences && (
                <Button
                  type="primary"
                  size="small"
                  icon={<ApiOutlined />}
                  disabled={!isAllowed}
                  onClick={() =>
                    dispatch(
                      fenceConnectionActions.setConnectionModalParams({
                        open: true,
                        onClose: () => {
                          if (isConnectedToFences) {
                            handleStartNotebookCluster();
                          }
                        },
                      }),
                    )
                  }
                >
                  {intl.get('global.connect')}
                </Button>
              )}

              {isConnectedToFences && !url && (
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

              {isConnectedToFences && url && isNotebookStatusLaunched(status) && (
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
