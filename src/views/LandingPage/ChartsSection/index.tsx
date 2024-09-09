import intl from 'react-intl-universal';
import { useKeycloak } from '@react-keycloak/web';
import StatsCharts from 'views/LandingPage/ChartsSection/Charts';
import StatsGrid from 'views/LandingPage/ChartsSection/Grid';
import LandingPageButton from 'views/LandingPage/Components/LandingPageButton';
import LandingPageParagraph from 'views/LandingPage/Components/LandingPageParagraph';
import LandingPageTitle from 'views/LandingPage/Components/LandingPageTitle';

import { REDIRECT_URI_KEY } from 'common/constants';
import useQueryParams from 'hooks/useQueryParams';
import { STATIC_ROUTES } from 'utils/routes';

import styles from './index.module.css';

const ChartsSection = () => {
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
    <div className={styles.chartsSection}>
      <div className={styles.content}>
        <div className={styles.descriptionSection}>
          <div className={styles.getStarted}>
            <LandingPageTitle margin={16}>
              {intl.get('screen.loginPage.chartsSection.title')}
            </LandingPageTitle>
            <LandingPageParagraph lead>
              {intl.get('screen.loginPage.chartsSection.description')}
            </LandingPageParagraph>
            <div>
              <LandingPageButton size="large" onClick={handleSignin}>
                {intl.get('screen.loginPage.chartsSection.getStarted')}
              </LandingPageButton>
            </div>
          </div>
          <StatsGrid />
        </div>

        <div className={styles.statsCharts}>
          <StatsCharts />
        </div>
      </div>
    </div>
  );
};

export default ChartsSection;
