import React, { useEffect } from 'react';
import StackLayout from '@ferlab/ui/core/layout/StackLayout';
import azicon from 'assets/appache-zeppelin.png';
import { Card, Typography, Switch, Alert, Button, Space } from 'antd';
import { Link } from 'uikit/Core';
import style from './WorkBench.module.scss';
import { RootState } from 'store/rootState';

import { connect, ConnectedProps } from 'react-redux';
import {
  ClusterStatus,
  ClusterUnverifiedStatus,
  DispatchWorkBench,
  isClusterStatusIdling,
  isClusterStatusInProgress,
  isClusterRunning,
  NO_OPEN_CONNECTION_DATA_INTEGRATION,
  UnAuthorizedClusterError,
} from 'store/WorkBenchTypes';
import { selectLoggedInUser } from 'store/selectors/users';
import {
  selectIsLoading,
  selectError,
  selectStatus,
  selectClusterUrl,
} from 'store/selectors/workBench';
import {
  getStatus,
  reInitializeState,
  startCluster,
  stopCluster,
} from 'store/actionCreators/workBench';
import useInterval from 'hooks/useInterval';
import IndeterminateProgress from 'components/UI/IndeterminateProgress';
import { LoggedInUser } from 'store/userTypes';

const POLLING_DELAY_IN_MS = 30000; //30[s]

const STOP_POLLING = null;

const { Paragraph, Text } = Typography;

const mapState = (state: RootState) => ({
  isLoadingStatus: selectIsLoading(state),
  error: selectError(state),
  status: selectStatus(state),
  url: selectClusterUrl(state),
  loggedInUser: selectLoggedInUser(state),
});

const mapDispatch = (dispatch: DispatchWorkBench) => ({
  onGetStatus: () => dispatch(getStatus()),
  onReInitializeState: () => dispatch(reInitializeState()),
  onStartCluster: () => dispatch(startCluster()),
  onStopCluster: () => dispatch(stopCluster()),
});

const connector = connect(mapState, mapDispatch);

type PropsFromRedux = ConnectedProps<typeof connector>;

type Props = { isAllowed: boolean } & PropsFromRedux;

const showSwitch = (status: ClusterStatus) =>
  status === ClusterUnverifiedStatus.unverified || isClusterStatusIdling(status);

const showProgress = (status: ClusterStatus) => isClusterStatusInProgress(status);

const showNoConnectionError = (error: Error | UnAuthorizedClusterError) =>
  NO_OPEN_CONNECTION_DATA_INTEGRATION === error.message;

const WorkBench = (props: Props) => {
  const {
    isLoadingStatus,
    error,
    status,
    onGetStatus,
    onStartCluster,
    onStopCluster,
    onReInitializeState,
    isAllowed,
    url,
    loggedInUser,
  } = props;

  useInterval(
    () => {
      onGetStatus();
    },
    // Delay in milliseconds or null to stop it
    isClusterStatusInProgress(status) || isClusterRunning(status)
      ? POLLING_DELAY_IN_MS
      : STOP_POLLING,
  );

  useEffect(() => {
    const shouldCheckStatus = isAllowed && !error && status === ClusterUnverifiedStatus.unverified;
    if (shouldCheckStatus) {
      onGetStatus();
    }
  }, [status, onGetStatus, error, isAllowed]);

  return (
    <Card>
      <StackLayout horizontal>
        <div className={style.imgContainer}>
          <img alt="Appache-Zeppelin-Logo" src={azicon} className={style.zeppelinImg} />
        </div>
        <StackLayout vertical className={style.textAndBtnContainer}>
          <Paragraph>
            Launch your own <Text strong>high performance compute environment</Text> to access the
            Kids First variant database using Apache Zeppelin notebooks.
          </Paragraph>
          <div>
            {!error && showSwitch(status) && (
              <Space size={'middle'}>
                <Switch
                  disabled={!isAllowed}
                  checked={isClusterRunning(status)}
                  loading={isLoadingStatus}
                  onChange={(switchIsOn: boolean) =>
                    switchIsOn ? onStartCluster() : onStopCluster()
                  }
                  checkedChildren={isLoadingStatus ? '' : 'On'}
                  unCheckedChildren={isLoadingStatus ? '' : 'Off'}
                />
                {!isAllowed && (
                  <Text disabled>Currently available for Kids First investigators only.</Text>
                )}
                {url && (
                  <Button href={url} target="_blank" rel="noopener noreferrer" type={'link'}>
                    Access your SPARK cluster
                  </Button>
                )}
              </Space>
            )}
            {showProgress(status) && <IndeterminateProgress />}
            {error && displayError(error, loggedInUser, onReInitializeState)}
          </div>
        </StackLayout>
      </StackLayout>
    </Card>
  );
};

const displayError = (
  error: UnAuthorizedClusterError | Error,
  loggedInUser: LoggedInUser,
  onReInitializeState: () => void,
) => {
  if (showNoConnectionError(error)) {
    return (
      <Alert
        className={style.alert}
        message={
          <div>
            <span>
              {
                'In order to lauch your notebook, you must first connect to your data repositories in your '
              }
            </span>
            <Link
              className="color-primary"
              to={{
                pathname: `/user/${loggedInUser._id}`,
                hash: '#settings',
              }}
            >
              account settings
            </Link>
            <span>.</span>
          </div>
        }
        type="error"
      />
    );
  } else {
    return (
      <Alert
        className={style.alert}
        message={
          <>
            <span>{'We were unable to complete this operation. '}</span>
            <a href={'mailto:support@kidsfirstdrc.org'}>Contact support</a>
            <span>{' if the issue persists'}</span>
          </>
        }
        type="error"
        action={
          <Button type="primary" danger onClick={() => onReInitializeState()}>
            Try again
          </Button>
        }
      />
    );
  }
};

export default connector(WorkBench);
