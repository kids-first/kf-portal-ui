import intl from 'react-intl-universal';
import { numberFormat } from '@ferlab/ui/core/utils/numberUtils';
import { useKeycloak } from '@react-keycloak/web';
import CollaboratorCard from 'views/LandingPage/CollaboratorSection/CollaboratorCard';
import LandingPageTitle from 'views/LandingPage/Components/LandingPageTitle';

import Cavatica from 'components/assets/cavatica-login-logo.png';
import GeneticEngineering from 'components/assets/genetic_engineering.png';
import Pedcbioportal from 'components/assets/pedcbioportal.png';
import {
  trackLandingPageCollaboratorCavatica,
  trackLandingPageCollaboratorPedcBioportal,
  trackLandingPageCollaboratorVariant,
} from 'services/analytics';
import { STATIC_ROUTES } from 'utils/routes';

import { useGlobals } from '../../../store/global';

import styles from './index.module.css';

const CollaboratorSection = () => {
  const { stats } = useGlobals();
  const { keycloak } = useKeycloak();

  const handleExternalRedirect = async (url: string) => {
    window.location.assign(url);
  };

  const handleSignin = async () => {
    const url = keycloak.createLoginUrl({
      redirectUri: `${window.location.origin}/${STATIC_ROUTES.VARIANTS}`,
      locale: intl.getInitOptions().currentLocale,
    });
    window.location.assign(url);
  };

  return (
    <div className={styles.collaboration}>
      <div className={styles.content}>
        <div className={styles.title}>
          <LandingPageTitle alt margin={24}>
            {intl.get('screen.loginPage.collaborationSection.title')}
          </LandingPageTitle>
          <LandingPageTitle level={4} alt>
            {intl.get('screen.loginPage.collaborationSection.description')}
          </LandingPageTitle>
        </div>
        <div className={styles.contentContainer}>
          <CollaboratorCard
            icon={<img src={GeneticEngineering} className={styles.logo} alt="Germline logo" />}
            title={`${numberFormat(stats?.variants ?? 0)}+ ${intl.get(
              'screen.loginPage.collaborationSection.variant.title',
            )}`}
            description={intl.get('screen.loginPage.collaborationSection.variant.description')}
            buttonText={intl.get('screen.loginPage.collaborationSection.variant.button')}
            handleClick={() => {
              trackLandingPageCollaboratorVariant();
              handleSignin();
            }}
          />
          <CollaboratorCard
            alt
            icon={<img src={Cavatica} className={styles.logo} />}
            description={intl.get('screen.loginPage.collaborationSection.cavatica.description')}
            buttonText={intl.get('screen.loginPage.collaborationSection.cavatica.button')}
            external
            handleClick={() => {
              trackLandingPageCollaboratorCavatica();
              handleExternalRedirect('https://www.cavatica.org/');
            }}
          />
          <CollaboratorCard
            icon={<img src={Pedcbioportal} className={styles.logo} />}
            alt
            description={intl.get(
              'screen.loginPage.collaborationSection.pedcbioportal.description',
            )}
            external
            buttonText={intl.get('screen.loginPage.collaborationSection.pedcbioportal.button')}
            handleClick={() => {
              trackLandingPageCollaboratorPedcBioportal();
              handleExternalRedirect('https://pedcbioportal.org/');
            }}
          />
        </div>
      </div>
    </div>
  );
};

export default CollaboratorSection;
