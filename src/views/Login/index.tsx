import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { useGlobals } from 'store/global';
import { useKeycloak } from '@react-keycloak/web';
import { fetchStats } from 'store/global/thunks';
import { Button, Space, Typography, Divider } from 'antd';
import intl from 'react-intl-universal';
import { STATIC_ROUTES } from 'utils/routes';
import KidsFirstLoginIcon from 'components/Icons/KidsFirstLoginIcon';
import DataRelease from 'components/uiKit/DataRelease';
import useQueryParams from 'hooks/useQueryParams';
import { REDIRECT_URI_KEY } from 'common/constants';

import styles from './index.module.scss';

const { Title } = Typography;
const formatNumberToLocaleString = (num: number) => (num || 0).toLocaleString('en-US');

const Login = (): React.ReactElement => {
  const { keycloak } = useKeycloak();
  const query = useQueryParams();
  const dispatch = useDispatch();
  const { stats } = useGlobals();

  const handleSignin = async () => {
    const url = keycloak.createLoginUrl({
      // eslint-disable-next-line max-len
      redirectUri: `${window.location.origin}/${
        query.get(REDIRECT_URI_KEY) || STATIC_ROUTES.DASHBOARD
      }`,
    });
    window.location.assign(url);
  };

  useEffect(() => {
    dispatch(fetchStats());
    // eslint-disable-next-line
  }, []);

  return (
    <div className={styles.loginPageContent}>
      <div className={styles.loginContainer}>
        <Space size={48} direction="vertical">
          <div className={styles.loginStats}>
            <Title level={4} className={styles.statsTitle}>
              {intl.get('screen.loginPage.datarelease.title')}
            </Title>
            <Divider className={styles.statsDivider} />
            <DataRelease className={styles.dataRelease} />
          </div>
          <div className={styles.logoTitleContainer}>
            <KidsFirstLoginIcon />
            <Title level={1} className={styles.logotTitle}>
              {intl.get('screen.loginPage.title')}
            </Title>
          </div>
          <div className={styles.loginDescription}>
            <Title level={2} className={styles.loginDescTitle}>
              {intl.get('screen.loginPage.accelerating')}{' '}
            </Title>
            <span className={styles.loginDescText}>
              {intl.get('screen.loginPage.accessLargeScale', {
                count: formatNumberToLocaleString(stats?.samples!),
              })}
            </span>
          </div>
          <Space className={styles.loginButtons} size={16}>
            <Button type={'primary'} onClick={handleSignin} size={'large'}>
              {intl.get('screen.loginPage.login')}
            </Button>
            <Button onClick={handleSignin} ghost size={'large'}>
              {intl.get('screen.loginPage.signup')}
            </Button>
          </Space>
        </Space>
      </div>
    </div>
  );
};
export default Login;
