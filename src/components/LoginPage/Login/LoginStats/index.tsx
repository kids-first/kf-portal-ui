import React, { useEffect, useState } from 'react';
import MultiLabel, {
  MultiLabelIconPositionEnum,
} from '@ferlab/ui/core/components/labels/MultiLabel';
import StackLayout from '@ferlab/ui/core/layout/StackLayout';
import { Spin } from 'antd';

import BookIcon from 'icons/BookIcon';
import ExperimentIcon from 'icons/ExperimentIcon';
import FileTextIcon from 'icons/FileTextIcon';
import StorageIcon from 'icons/StorageIcon';
import TeamIcon from 'icons/TeamIcon';
import UserIcon from 'icons/UserIcon';
import { fetchPublicStats } from 'services/publicStatistics';
import { abbreviateNumber } from 'utils';

import style from './index.module.scss';

const formatCounts = (num: number) => abbreviateNumber(num);
const formatStorage = (storage: string) => storage.replace(' ', '');
const iconSize = { height: 24, width: 24 };

const LoginStats = () => {
  const [stats, setStats] = useState({
    files: 0,
    fileSize: '0 TB',
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

  return (
    <div className={style.loginStats}>
      <h4>Available Data</h4>
      <hr />
      <Spin spinning={loading}>
        <StackLayout className={style.loginStatsContainer}>
          <MultiLabel
            iconPosition={MultiLabelIconPositionEnum.Top}
            label={formatCounts(stats?.studies)}
            Icon={<BookIcon className={style.loginPageIconColor} {...iconSize} />}
            className={style.loginStatsLabel}
            subLabel={'Studies'}
          />
          <MultiLabel
            iconPosition={MultiLabelIconPositionEnum.Top}
            label={formatCounts(stats?.participants)}
            Icon={<UserIcon className={style.loginPageIconColor} {...iconSize} />}
            className={style.loginStatsLabel}
            subLabel={'Participants'}
          />
          <MultiLabel
            iconPosition={MultiLabelIconPositionEnum.Top}
            label={formatCounts(stats?.families)}
            Icon={<TeamIcon className={style.loginPageIconColor} {...iconSize} />}
            className={style.loginStatsLabel}
            subLabel={'Families'}
          />
          <MultiLabel
            iconPosition={MultiLabelIconPositionEnum.Top}
            label={formatCounts(stats?.samples)}
            Icon={<ExperimentIcon className={style.loginPageIconColor} {...iconSize} />}
            className={style.loginStatsLabel}
            subLabel={'Biospecimen'}
          />
          <MultiLabel
            iconPosition={MultiLabelIconPositionEnum.Top}
            label={formatCounts(stats?.files)}
            Icon={<FileTextIcon className={style.loginPageIconColor} {...iconSize} />}
            className={style.loginStatsLabel}
            subLabel={'Data Files'}
          />
          <MultiLabel
            iconPosition={MultiLabelIconPositionEnum.Top}
            label={formatStorage(stats?.fileSize)}
            Icon={<StorageIcon className={style.loginPageIconColor} {...iconSize} />}
            className={style.loginStatsLabel}
            subLabel={'Storage'}
          />
        </StackLayout>
      </Spin>
    </div>
  );
};

export default LoginStats;
