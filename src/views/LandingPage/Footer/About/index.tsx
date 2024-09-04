import intl from 'react-intl-universal';
import LandingPageTitle from 'views/LandingPage/Components/LandingPageTitle';

import chicago from 'components/assets/chicago.png';
import chop from 'components/assets/chop.png';
import chu from 'components/assets/chu.png';
import unc from 'components/assets/unc.png';
import vanderbilt from 'components/assets/vanderbilt.png';
import versera from 'components/assets/velsera.png';

import styles from './index.module.css';

const About = () => (
  <div className={styles.about}>
    <div className={styles.navigation}>
      <div className={styles.row}>
        <LandingPageTitle level={4}>
          {intl.get('screen.loginPage.footer.about.about')}
        </LandingPageTitle>
        <a className={styles.link} href="https://kidsfirstdrc.org/about/">
          {intl.get('screen.loginPage.footer.about.aboutKF')}
        </a>
        <a className={styles.link} href="https://kidsfirstdrc.org/community/">
          {intl.get('screen.loginPage.footer.about.community')}
        </a>
        <a className={styles.link} href="https://kidsfirstdrc.org/help-center/">
          {intl.get('screen.loginPage.footer.about.faqs')}
        </a>
      </div>

      <div className={styles.row}>
        <LandingPageTitle level={4}>
          {intl.get('screen.loginPage.footer.about.resources')}
        </LandingPageTitle>
        <a className={styles.link} href="https://kidsfirstdrc.org/news/">
          {intl.get('screen.loginPage.footer.about.data')}
        </a>
        <a className={styles.link} href="https://kidsfirstdrc.org/events/">
          {intl.get('screen.loginPage.footer.about.tools')}
        </a>
        <a className={styles.link} href="https://kidsfirstdrc.org/category/press/">
          {intl.get('screen.loginPage.footer.about.helpCenter')}
        </a>
      </div>

      <div className={styles.row}>
        <LandingPageTitle level={4}>
          {intl.get('screen.loginPage.footer.about.news')}
        </LandingPageTitle>
        <a className={styles.link} href={'#'}>
          {intl.get('screen.loginPage.footer.about.articles')}
        </a>
        <a className={styles.link} href={'#'}>
          {intl.get('screen.loginPage.footer.about.events')}
        </a>
        <a className={styles.link} href={'#'}>
          {intl.get('screen.loginPage.footer.about.press')}
        </a>
      </div>
    </div>
    <div>
      <LandingPageTitle className={styles.partnersTitle} level={4} margin={16}>
        {intl.get('screen.loginPage.footer.about.partner')}
      </LandingPageTitle>
      <div className={styles.partners}>
        <div className={styles.row}>
          <a href="https://d3b.center/" target="_blank">
            <img src={chop} />
          </a>
          <a href="https://www.chusj.org/Home" target="_blank">
            <img src={chu} />
          </a>
        </div>
        <div className={styles.row}>
          <a href="https://www.unchealth.org/home" target="_blank">
            <img src={unc} />
          </a>
          <a href="https://ctds.uchicago.edu/" target="_blank">
            <img src={chicago} />
          </a>
        </div>
        <div className={styles.row}>
          <a href="https://velsera.com/" target="_blank">
            <img src={versera} />
          </a>
          <a href="https://medschool.vanderbilt.edu/" target="_blank">
            <img src={vanderbilt} />
          </a>
        </div>
      </div>
    </div>
  </div>
);

export default About;
