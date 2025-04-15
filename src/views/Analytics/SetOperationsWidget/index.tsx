import intl from 'react-intl-universal';
import { useNavigate } from 'react-router';
import { BarChartOutlined } from '@ant-design/icons';
import { Button, Card, Divider, Space, Tag, Typography } from 'antd';

import logo from 'components/assets/analytics/newsletterWidget1.svg';
import { trackLaunchSetOperations } from 'services/analytics';
import { STATIC_ROUTES } from 'utils/routes';

import styles from './index.module.css';

const { Title, Paragraph } = Typography;

const SetOperationsWidget = () => {
  const navigate = useNavigate();
  return (
    <Card className={styles.widget}>
      <Space direction="vertical" size={16} className={styles.spaceWrapper}>
        <Space direction="vertical" size={24} className={styles.contentWrapper}>
          <img alt="Logo" src={logo} height={75} width={75} />
          <div>
            <Title level={5}>{intl.get('screen.analytics.setOperations.title')}</Title>
            <Paragraph className={styles.description}>
              {intl.get('screen.analytics.setOperations.description')}
            </Paragraph>
          </div>
          <Space size={8}>
            <Tag color="gold">{intl.get('screen.analytics.setOperations.tags.clinical')}</Tag>
            <Tag color="blue">{intl.get('screen.analytics.setOperations.tags.genomics')}</Tag>
          </Space>
        </Space>
        <Divider className={styles.divider} />
        <div className={styles.footerWrapper}>
          <Button
            onClick={() => {
              trackLaunchSetOperations();
              navigate(STATIC_ROUTES.ANALYTICS_SET_OPERATIONS);
            }}
            icon={<BarChartOutlined />}
          >
            {intl.get('screen.analytics.setOperations.launch')}
          </Button>
        </div>
      </Space>
    </Card>
  );
};

export default SetOperationsWidget;
