import intl from 'react-intl-universal';
import { Divider } from 'antd';
import cx from 'classnames';
import LandingPageParagraph from 'views/LandingPage/Components/LandingPageParagraph';
import About from 'views/LandingPage/Footer/About';
import FooterCard from 'views/LandingPage/Footer/Card';
import Socials from 'views/LandingPage/Footer/Socials';

import {
  trackLandingPageFooterHelpCenter,
  trackLandingPageFooterPublications,
} from 'services/analytics';

import styles from './index.module.css';

const Footer = () => {
  const handleExternalRedirect = async (url: string) => {
    window.location.assign(url);
  };
  return (
    <div className={styles.footer}>
      <div className={styles.contentContainer}>
        <div className={styles.cards}>
          <FooterCard
            title={intl.get('screen.loginPage.footer.inspiration.title')}
            description={intl.get('screen.loginPage.footer.inspiration.description')}
            buttonText={intl.get('screen.loginPage.footer.inspiration.button')}
            external
            handleClick={() => {
              trackLandingPageFooterPublications();
              handleExternalRedirect('https://kidsfirstdrc.org/publications/');
            }}
          />
          <FooterCard
            title={intl.get('screen.loginPage.footer.answers.title')}
            description={intl.get('screen.loginPage.footer.answers.description')}
            buttonText={intl.get('screen.loginPage.footer.answers.button')}
            external
            handleClick={() => {
              trackLandingPageFooterHelpCenter();
              handleExternalRedirect('https://kidsfirstdrc.org/help-center/');
            }}
          />
        </div>
        <Divider className={styles.divider} />
        <About />
        <Socials />
        <Divider className={cx(styles.divider, styles.legals)} />
        <div className={styles.legals}>
          <LandingPageParagraph small>
            {intl.get('screen.loginPage.footer.legal.description')}
          </LandingPageParagraph>
          <LandingPageParagraph small>
            {intl.get('screen.loginPage.footer.legal.mention')}
          </LandingPageParagraph>
        </div>
      </div>
    </div>
  );
};

export default Footer;
