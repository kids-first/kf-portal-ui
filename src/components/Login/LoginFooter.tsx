import React from 'react';

import styles from './Login.module.scss';

const LoginFooter = () => (
  <div className={styles.loginFooter}>
    <h3>{'Funding & Support'}</h3>
    <span>
      The Gabriella Miller Kids First Data Resource Center is funded by the <a>NIH Common Fund</a>{' '}
      and collaborates with <a>member institutions</a>.
    </span>
  </div>
);

export default LoginFooter;
