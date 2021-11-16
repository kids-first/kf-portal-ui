import React from 'react';

import Login from 'components/LoginPage/Login';
import LoginFooter from 'components/LoginPage/LoginFooter';

import styles from './index.module.scss';

const LoginPage = () => (
  <div className={styles.loginPage}>
    <Login />
    <LoginFooter />
  </div>
);

export default LoginPage;
