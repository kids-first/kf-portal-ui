import intl from 'react-intl-universal';
import { Divider } from 'antd';
import cx from 'classnames';
import LandingPageParagraph from 'views/LandingPage/Components/LandingPageParagraph';
import About from 'views/LandingPage/Footer/about';
import FooterCard from 'views/LandingPage/Footer/Card';
import Socials from 'views/LandingPage/Footer/socials';

import styles from './index.module.css';

const Footer = () => (
  <div className={styles.footer}>
    <div className={styles.contentContainer}>
      <div className={styles.cards}>
        <FooterCard
          title={intl.get('screen.loginPage.footer.inspiration.title')}
          description={intl.get('screen.loginPage.footer.inspiration.description')}
          buttonText={intl.get('screen.loginPage.footer.inspiration.button')}
        />
        <FooterCard
          title={intl.get('screen.loginPage.footer.answers.title')}
          description={intl.get('screen.loginPage.footer.answers.description')}
          buttonText={intl.get('screen.loginPage.footer.answers.button')}
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

export default Footer;
