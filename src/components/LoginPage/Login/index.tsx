import React, { useEffect, useState } from 'react';
import { Redirect } from 'react-router-dom';
import MultiLabel, {
  MultiLabelIconPositionEnum,
} from '@ferlab/ui/core/components/labels/MultiLabel';
import StackLayout from '@ferlab/ui/core/layout/StackLayout';
import { useKeycloak } from '@react-keycloak/web';
import { Button, Spin } from 'antd';

import ROUTES from 'common/routes';
import BookIcon from 'icons/BookIcon';
import ExperimentIcon from 'icons/ExperimentIcon';
import FileTextIcon from 'icons/FileTextIcon';
import KidsFirstIcon from 'icons/KidsFirstIcon';
import StorageIcon from 'icons/StorageIcon';
import TeamIcon from 'icons/TeamIcon';
import UserIcon from 'icons/UserIcon';
import { fetchPublicStats } from 'services/publicStatistics';
import ButtonWithRouter from 'ui/Buttons/ButtonWithRouter';
import { abbreviateNumber } from 'utils';

import styles from './index.module.scss';

const formatNumberToLocaleString = (num: number) => (num || 0).toLocaleString('en-US');
const formatCounts = (num: number) => abbreviateNumber(num);
const formatStorage = (storage: string) => {
  const parts = storage.split(/\.| /);
  return `${parts[0]}${parts[2]}`;
};
const iconSize = { height: 24, width: 24 };

const Login = (): React.ReactElement => {
  const { keycloak } = useKeycloak();
  const isAuthenticated = keycloak.authenticated || false;

  const [stats, setStats] = useState({
    files: 0,
    fileSize: '0.0 TB',
    studies: 0,
    samples: 0,
    families: 0,
    participants: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      const result = await fetchPublicStats();
      setStats(result);
      setLoading(false);
    };

    fetchData();
  }, []);

  if (isAuthenticated) {
    return <Redirect to={ROUTES.dashboard} />;
  }

  return (
    <div className={styles.loginContainer}>
      <div className={styles.loginStats}>
        <h4>Available Data</h4>
        <hr />
        <Spin spinning={loading}>
          <StackLayout className={styles.loginStatsContainer}>
            <MultiLabel
              iconPosition={MultiLabelIconPositionEnum.Top}
              label={formatCounts(stats?.studies)}
              Icon={<BookIcon className={styles.loginPageIconColor} {...iconSize} />}
              className={styles.loginStatsLabel}
              subLabel={'Studies'}
            />
            <MultiLabel
              iconPosition={MultiLabelIconPositionEnum.Top}
              label={formatCounts(stats?.participants)}
              Icon={<UserIcon className={styles.loginPageIconColor} {...iconSize} />}
              className={styles.loginStatsLabel}
              subLabel={'Participants'}
            />
            <MultiLabel
              iconPosition={MultiLabelIconPositionEnum.Top}
              label={formatCounts(stats?.families)}
              Icon={<TeamIcon className={styles.loginPageIconColor} {...iconSize} />}
              className={styles.loginStatsLabel}
              subLabel={'Families'}
            />
            <MultiLabel
              iconPosition={MultiLabelIconPositionEnum.Top}
              label={formatCounts(stats?.samples)}
              Icon={<ExperimentIcon className={styles.loginPageIconColor} {...iconSize} />}
              className={styles.loginStatsLabel}
              subLabel={'Samples'}
            />
            <MultiLabel
              iconPosition={MultiLabelIconPositionEnum.Top}
              label={formatCounts(stats?.files)}
              Icon={<FileTextIcon className={styles.loginPageIconColor} {...iconSize} />}
              className={styles.loginStatsLabel}
              subLabel={'Files'}
            />
            <MultiLabel
              iconPosition={MultiLabelIconPositionEnum.Top}
              label={formatStorage(stats?.fileSize)}
              Icon={<StorageIcon className={styles.loginPageIconColor} {...iconSize} />}
              className={styles.loginStatsLabel}
              subLabel={'Storage'}
            />
          </StackLayout>
        </Spin>
      </div>
      <div className={styles.loginHeader}>
        <KidsFirstIcon />
        <h1>Kids First Data Resource Portal</h1>
      </div>
      <h2>
        Accelerating research and promoting new discoveries for children affected with cancer and
        structural birth defects.
      </h2>
      <span>
        Data from over {formatNumberToLocaleString(stats.samples)} samples, including whole genome
        sequencing (WGS) and RNA-Sequencing, is available to empower your research today.
      </span>
      <div className={styles.loginButtons}>
        <Button
          type={'primary'}
          onClick={async () => {
            const url = keycloak.createLoginUrl({
              // eslint-disable-next-line max-len
              redirectUri: `${window.location.origin}/${ROUTES.dashboard}`,
            });
            location.assign(url);
          }}
          size={'large'}
        >
          {'Log in'}
        </Button>
        <ButtonWithRouter type={'default'} size={'large'} getLink={async () => ROUTES.join}>
          {'Sign up'}
        </ButtonWithRouter>
      </div>
    </div>
  );
};
export default Login;
