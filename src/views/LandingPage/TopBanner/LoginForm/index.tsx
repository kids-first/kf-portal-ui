import intl from 'react-intl-universal';
import { useKeycloak } from '@react-keycloak/web';
import LandingPageButton from 'views/LandingPage/Components/LandingPageButton';
import LandingPageParagraph from 'views/LandingPage/Components/LandingPageParagraph';
import LandingPageTitle from 'views/LandingPage/Components/LandingPageTitle';

import { REDIRECT_URI_KEY } from 'common/constants';
import logo from 'components/assets/logo.svg';
import useQueryParams from 'hooks/useQueryParams';
import { STATIC_ROUTES } from 'utils/routes';

import styles from './index.module.css';

export const LoginForm = () => {
  const { keycloak } = useKeycloak();
  const query = useQueryParams();

  const handleSignin = async () => {
    const url = keycloak.createLoginUrl({
      redirectUri: `${window.location.origin}/${
        query.get(REDIRECT_URI_KEY) || STATIC_ROUTES.DASHBOARD
      }`,
    });
    window.location.assign(url);
  };

  return (
    <div className={styles.login}>
      <div className={styles.text}>
        <img className={styles.logo} src={logo} alt="kids-first-logo" />
        <LandingPageTitle>{intl.get('screen.loginPage.topBanner.title')}</LandingPageTitle>
        <div className={styles.description}>
          <LandingPageParagraph lead>
            {intl.get('screen.loginPage.topBanner.subtitle1')}
          </LandingPageParagraph>
          <LandingPageParagraph lead>
            {intl.get('screen.loginPage.topBanner.subtitle2')}
          </LandingPageParagraph>
          <LandingPageParagraph className={styles.small}>
            {intl.get('screen.loginPage.topBanner.subtitle3')}
          </LandingPageParagraph>
        </div>
      </div>
      <div className={styles.buttons}>
        <LandingPageButton alt onClick={handleSignin} size="large">
          {intl.get('screen.loginPage.login')}
        </LandingPageButton>
        <LandingPageButton onClick={handleSignin} size="large">
          {intl.get('screen.loginPage.signup')}
        </LandingPageButton>
      </div>
    </div>
  );
};
