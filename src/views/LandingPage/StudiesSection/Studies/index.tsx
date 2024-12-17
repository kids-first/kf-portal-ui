import intl from 'react-intl-universal';
import { useNavigate } from 'react-router';
import { Typography } from 'antd';
import LandingPageButton from 'views/LandingPage/Components/LandingPageButton';
import LandingPageTitle from 'views/LandingPage/Components/LandingPageTitle';

import studiesSvg from 'components/assets/kf-portal-icons_studies_2.svg';
import { trackViewAllStudies } from 'services/analytics';
import { useGlobals } from 'store/global';
import { STATIC_ROUTES } from 'utils/routes';

import styles from './index.module.css';

const { Paragraph } = Typography;

const StudiesSection = () => {
  const { stats } = useGlobals();
  const navigate = useNavigate();
  const studiesBtnOnClick = () => {
    trackViewAllStudies();
    navigate(STATIC_ROUTES.PUBLIC_STUDIES);
  };

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
      {studiesBtnOnClick && (
        <LandingPageButton className={styles.viewAllBtn} onClick={studiesBtnOnClick}>
          {intl.get('screen.publicStudies.viewAllBtn')}
        </LandingPageButton>
      )}
    </div>
  );
};

export default StudiesSection;
