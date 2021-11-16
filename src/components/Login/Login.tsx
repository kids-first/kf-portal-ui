import React from 'react';
import { Redirect } from 'react-router-dom';
import { useKeycloak } from '@react-keycloak/web';
import { Button } from 'antd';

import ROUTES from 'common/routes';
import KidsFirstIcon from 'icons/KidsFirstIcon';
import ButtonWithRouter from 'ui/Buttons/ButtonWithRouter';

import LoginStats from './LoginStats';

import styles from './Login.module.scss';

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
        <div>
          <Button
            className={styles.login}
            type={'primary'}
            onClick={async () => {
              const url = keycloak.createLoginUrl({
                // eslint-disable-next-line max-len
                redirectUri: `${window.location.origin}/${ROUTES.dashboard}`,
              });
              location.assign(url);
            }}
          >
            {'Log in'}
          </Button>
        </div>
        <div className={styles.signup}>
          <ButtonWithRouter type={'default'} getLink={async () => ROUTES.join}>
            {'Sign up'}
          </ButtonWithRouter>
        </div>
      </div>
    </div>
  );
};
export default Login;
