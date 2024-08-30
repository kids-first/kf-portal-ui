import intl from 'react-intl-universal';
import { useKeycloak } from '@react-keycloak/web';
import { Space } from 'antd';
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
      // eslint-disable-next-line max-len
      redirectUri: `${window.location.origin}/${
        query.get(REDIRECT_URI_KEY) || STATIC_ROUTES.DASHBOARD
      }`,
    });
    window.location.assign(url);
  };

  return (
    <Space className={styles.login} align="start" size={24}>
      <Space direction="vertical" size={24}>
        <img className={styles.logo} src={logo} alt="kids-first-logo" />
        <LandingPageTitle>{intl.get('screen.loginPage.topBanner.title')}</LandingPageTitle>
        <Space direction="vertical" size={16}>
          <LandingPageParagraph lead>
            {intl.get('screen.loginPage.topBanner.subtitle1')}
          </LandingPageParagraph>
          <LandingPageParagraph lead>
            {intl.get('screen.loginPage.topBanner.subtitle2')}
          </LandingPageParagraph>
          <LandingPageParagraph className={styles.small}>
            {intl.get('screen.loginPage.topBanner.subtitle3')}
          </LandingPageParagraph>
        </Space>
      </Space>
      <Space size={16}>
        <LandingPageButton onClick={handleSignin} size="large">
          {intl.get('screen.loginPage.signup')}
        </LandingPageButton>
        <LandingPageButton alt onClick={handleSignin} size="large">
          {intl.get('screen.loginPage.login')}
        </LandingPageButton>
      </Space>
    </Space>
  );
};
