import React from 'react';

import Column from 'uikit/Column';

import styles from './AccessGate.module.css';

const AccessGate = ({
  title,
  detail,
  Icon,
  infoLink = { text: 'functionality', url: '' },
  children,
  mt,
}) => (
  <Column style={{ alignItems: 'center' }}>
    <Column className={styles.wrapper} mt={mt}>
      <div className={styles.iconWrapper}>
        <div className={styles.iconBackground}>
          <Icon size="23px" />
        </div>
      </div>
      <div className={styles.heading}>{title}</div>
      <p className={styles.message}>{detail}</p>
      <div style={{ margin: '20px 0' }}>{children}</div>
    </Column>
  </Column>
);

export default AccessGate;
