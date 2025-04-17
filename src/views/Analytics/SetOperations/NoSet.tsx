import intl from 'react-intl-universal';
import { Space, Typography } from 'antd';

import logo from 'components/assets/analytics/newsletterWidget1.svg';
import { STATIC_ROUTES } from 'utils/routes';

import styles from './index.module.css';

const NoSet = () => (
  <Space size={24} direction="vertical" align="center" className={styles.noSetWrapper}>
    <img alt="Logo" src={logo} height={158} width={156} />
    <div className={styles.noSetContent}>
      <Typography.Title level={4} className={styles.noSetTitle}>
        {intl.get('screen.analytics.setOperations.noSet.title')}
      </Typography.Title>
      <Typography.Text className={styles.noSetDescription}>
        {intl.getHTML('screen.analytics.setOperations.noSet.description', {
          dataExploration: STATIC_ROUTES.DATA_EXPLORATION,
          variantExploration: STATIC_ROUTES.VARIANTS,
        })}
      </Typography.Text>
    </div>
  </Space>
);

export default NoSet;
