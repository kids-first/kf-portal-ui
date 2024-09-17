import intl from 'react-intl-universal';
import Carousel from 'views/LandingPage/StudiesSection/Carousel';

import LandingPageTitle from '../Components/LandingPageTitle';

import Studies from './Studies';

import styles from './index.module.css';

const StudiesSection = () => (
  <div className={styles.studiesSection}>
    <div className={styles.title}>
      <LandingPageTitle alt>{intl.get('screen.loginPage.studies.sectionTitle')}</LandingPageTitle>
    </div>
    <div className={styles.content}>
      <Studies />
      <Carousel />
    </div>
  </div>
);

export default StudiesSection;
