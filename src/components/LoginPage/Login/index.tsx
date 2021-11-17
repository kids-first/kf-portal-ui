import React from 'react';
import { Redirect } from 'react-router-dom';
import { useKeycloak } from '@react-keycloak/web';
import { Button } from 'antd';

import ROUTES from 'common/routes';
import LoginStats from 'components/LoginPage/Login/LoginStats';
import KidsFirstIcon from 'icons/KidsFirstIcon';
import ButtonWithRouter from 'ui/Buttons/ButtonWithRouter';

import styles from './index.module.scss';

const Login = (): React.ReactElement => {
  const { keycloak } = useKeycloak();
  const isAuthenticated = keycloak.authenticated || false;

  if (isAuthenticated) {
    return <Redirect to={ROUTES.dashboard} />;
  }

  return (
    <div className={styles.loginContainer}>
      <LoginStats />
      <div className={styles.loginHeader}>
        <KidsFirstIcon width={56} height={56} />
        <h1>Kids First DATA PORTAL</h1>
      </div>
      <h2>
        Accelerating research and promoting new discoveries for children affected with cancer and
        structural birth defects.
      </h2>
      <span>
        Data from over 27 thousand samples, including DNA and RNA, is available to empower your
        research today.
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
