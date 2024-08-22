import header from 'components/assets/login-header.png';

import styles from './index.module.css';

export const GradientHeader = () => (
  <div className={styles.gradientHeader}>
    <img className={styles.banner} src={header} width="auto" height="562px" />
    <div className={styles.gradient} />
  </div>
);
