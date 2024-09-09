import intl from 'react-intl-universal';
import { Typography } from 'antd';
import LandingPageButton from 'views/LandingPage/Components/LandingPageButton';
import LandingPageTitle from 'views/LandingPage/Components/LandingPageTitle';

import studiesSvg from 'components/assets/kf-portal-icons_studies_2.svg';
import { useGlobals } from 'store/global';

import styles from './index.module.css';

const { Paragraph } = Typography;

const StudiesSection = () => {
  const { stats } = useGlobals();

  return (
    <div className={styles.studiesContainer}>
      <div className={styles.titleContainer}>
        <img src={studiesSvg} alt="studies logo" />
        <LandingPageTitle level={2} alt>
          {intl.get('screen.loginPage.studies.title', { count: stats?.studies })}
        </LandingPageTitle>
      </div>
      <Paragraph className={styles.subtitle}>
        {intl.get('screen.loginPage.studies.explore')}
      </Paragraph>
      <LandingPageButton size="large">
        {intl.get('screen.loginPage.studies.viewAll')}
      </LandingPageButton>
    </div>
  );
};

export default StudiesSection;
