import React from 'react';

import Login from './Login';
import LoginFooter from './LoginFooter';

import styles from './Login.module.scss';

const LoginPage = () => (
  <div className={styles.loginPage}>
    <Login />
    <LoginFooter />
  </div>
);

export default LoginPage;
