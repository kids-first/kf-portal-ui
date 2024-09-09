import intl from 'react-intl-universal';
import LandingPageButton from 'views/LandingPage/Components/LandingPageButton';
import LandingPageParagraph from 'views/LandingPage/Components/LandingPageParagraph';

import facebook from 'components/assets/facebook-f.svg';
import instagram from 'components/assets/instagram.svg';
import linkedIn from 'components/assets/linkedin-in.svg';
import twitter from 'components/assets/x-twitter.svg';
import youtube from 'components/assets/youtube.svg';

import styles from './index.module.css';

const SIZE = 20;

const Socials = () => (
  <div className={styles.socials}>
    <a href="https://www.facebook.com/kidsfirstDRC" target="blank">
      <img src={facebook} width={SIZE} height={SIZE} alt="facebook" />
    </a>
    <a href="https://twitter.com/kidsfirstDRC" target="blank">
      <img src={twitter} width={SIZE} height={SIZE} alt="twitter" />
    </a>
    <a href="https://www.linkedin.com/company/kidsfirstdrc/" target="blank">
      <img src={linkedIn} width={SIZE} height={SIZE} alt="linkedIn" />
    </a>
    <a href="https://www.instagram.com/kidsfirstdrc/" target="blank">
      <img src={instagram} width={SIZE} height={SIZE} alt="instagram" />
    </a>
    <a href="https://www.youtube.com/channel/UCK9sPu0j4_ci4m3nNFa6gVw" target="blank">
      <img src={youtube} width={SIZE} height={SIZE} alt="youtube" />
    </a>
    <LandingPageParagraph>
      {intl.get('screen.loginPage.footer.socials.follow')}
    </LandingPageParagraph>
    <LandingPageButton
      className={styles.email}
      type="primary"
      size="large"
      href="mailto:support@kidsfirstdrc.org"
    >
      {intl.get('screen.loginPage.footer.socials.email')}
    </LandingPageButton>
    <a href="https://kidsfirstdrc.org/policies/#privacy">
      {intl.get('screen.loginPage.footer.socials.privacy')}
    </a>
    <a href="https://kidsfirstdrc.org/policies/#cookies">
      {intl.get('screen.loginPage.footer.socials.cookies')}
    </a>
  </div>
);

export default Socials;
