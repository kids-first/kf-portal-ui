import intl from 'react-intl-universal';
import { useKeycloak } from '@react-keycloak/web';
import { Typography } from 'antd';
import CollaboratorCard from 'views/LandingPage/CollaboratorSection/CollaboratorCard';
import LandingPageTitle from 'views/LandingPage/Components/LandingPageTitle';

import { REDIRECT_URI_KEY } from 'common/constants';
import Cavatica from 'components/assets/cavatica-login-logo.png';
import GeneticEngineering from 'components/assets/genetic_engineering.png';
import Pedcbioportal from 'components/assets/pedcbioportal.png';
import useQueryParams from 'hooks/useQueryParams';
import { STATIC_ROUTES } from 'utils/routes';

import styles from './index.module.css';

const { Title } = Typography;

const CollaboratorSection = () => {
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
    <div className={styles.collaboration}>
      <div className={styles.content}>
        <div className={styles.title}>
          <LandingPageTitle alt margin={24}>
            {intl.get('screen.loginPage.collaborationSection.title')}
          </LandingPageTitle>
          <LandingPageTitle level={4} alt>
            <Title level={4}>{intl.get('screen.loginPage.collaborationSection.description')}</Title>
          </LandingPageTitle>
        </div>
        <div className={styles.contentContainer}>
          <CollaboratorCard
            icon={<img src={GeneticEngineering} />}
            title={intl.get('screen.loginPage.collaborationSection.variant.title')}
            description={intl.get('screen.loginPage.collaborationSection.variant.description')}
            buttonText={intl.get('screen.loginPage.collaborationSection.variant.button')}
          />
          <CollaboratorCard
            alt
            icon={<img src={Cavatica} />}
            description={intl.get('screen.loginPage.collaborationSection.cavatica.description')}
            buttonText={intl.get('screen.loginPage.collaborationSection.cavatica.button')}
            external
            handleClick={handleSignin}
          />
          <CollaboratorCard
            icon={<img src={Pedcbioportal} />}
            alt
            description={intl.get(
              'screen.loginPage.collaborationSection.pedcbioportal.description',
            )}
            external
            buttonText={intl.get('screen.loginPage.collaborationSection.pedcbioportal.button')}
            handleClick={handleSignin}
          />
        </div>
      </div>
    </div>
  );
};

export default CollaboratorSection;
