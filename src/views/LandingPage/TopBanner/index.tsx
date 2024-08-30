import { GradientHeader } from 'views/LandingPage/TopBanner/GradientHeader';
import { LoginForm } from 'views/LandingPage/TopBanner/LoginForm';

import styles from './index.module.css';

const TopBanner = () => (
  <div className={styles.topBanner}>
    <div className={styles.contentContainer}>
      <LoginForm />
      <GradientHeader />
    </div>
  </div>
);

export default TopBanner;
