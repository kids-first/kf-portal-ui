import React from 'react';

import Login from 'components/Login/Login';
import LoginFooter from 'components/Login/LoginFooter';

import styles from './Login.module.scss';

const LoginPage = () => (
  <div className={styles.loginPage}>
    <Login />
    <LoginFooter />
  </div>
);

export default LoginPage;
