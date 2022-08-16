import { Space, Typography } from 'antd';
import { useUser } from 'store/user';
import intl from 'react-intl-universal';
import SortableGrid from '@ferlab/ui/core/layout/SortableGrid';
import { getFTEnvVarByKey } from 'helpers/EnvVariables';
import { AlterTypes } from 'common/types';
import NotificationBanner from 'components/featureToggle/NotificationBanner';
import { dashboardCards } from './components/DashboardCards';
import { useDispatch } from 'react-redux';
import { updateUserConfig } from 'store/user/thunks';
import DataExplorationLinks from './components/DashboardCards/DataExplorationLinks';
import { orderCardIfNeeded } from 'utils/helper';
import {
  FT_DASHBOARD_BANNER,
  FT_DASHBOARD_BANNER_TYPE,
  FT_DASHBOARD_BANNER_MSG,
} from 'common/featureToggle';

import styles from './index.module.scss';

const { Title } = Typography;

const Dashboard = () => {
  const dispatch = useDispatch();
  const { userInfo } = useUser();

  return (
    <Space direction="vertical" size={24} className={styles.dashboardWrapper}>
      <Space className={styles.dataIntroWrapper} direction="vertical" size={16}>
        <NotificationBanner
          featureToggleKey={FT_DASHBOARD_BANNER}
          type={getFTEnvVarByKey<AlterTypes>(FT_DASHBOARD_BANNER_TYPE, 'info')}
          message={getFTEnvVarByKey(FT_DASHBOARD_BANNER_MSG)}
          closable
          showIcon
        />
        <Title level={4} className={styles.greeting}>
          {intl.get('screen.dashboard.hello')}, {userInfo?.first_name}
        </Title>
        <DataExplorationLinks />
      </Space>
      <SortableGrid
        onReorder={(ids) =>
          dispatch(
            updateUserConfig({
              dashboard: {
                cards: {
                  order: ids,
                },
              },
            }),
          )
        }
        items={orderCardIfNeeded(dashboardCards, userInfo?.config.dashboard?.cards?.order)}
        gutter={[24, 24]}
      />
    </Space>
  );
};

export default Dashboard;
