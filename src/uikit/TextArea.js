import React from 'react';

import styles from '../theme/tempTheme.module.css';

export default ({ children, className = '', ...props }) => (
  <textarea className={`${styles.input} ${styles.textarea} ${className}`} {...props}>
    {children}
  </textarea>
);
