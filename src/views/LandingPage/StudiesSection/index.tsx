import { useEffect } from 'react';
import intl from 'react-intl-universal';
import { useDispatch } from 'react-redux';
import { Typography } from 'antd';
import LandingPageButton from 'views/LandingPage/Components/LandingPageButton';
import LandingPageTitle from 'views/LandingPage/Components/LandingPageTitle';
import LoginCarousel from 'views/LandingPage/StudiesSection/Carousel';

import studiesSvg from 'components/assets/kf-portal-icons_studies_2.svg';
import { useGlobals } from 'store/global';
import { fetchStats } from 'store/global/thunks';

import styles from './index.module.css';

const { Paragraph } = Typography;

const StudiesSection = () => {
  const dispatch = useDispatch();
  const { stats } = useGlobals();

  useEffect(() => {
    dispatch(fetchStats());
    // eslint-disable-next-line
  }, []);

  return (
    <div className={styles.studies}>
      <div className={styles.content}>
        <div className={styles.title}>
          <LandingPageTitle alt>
            {intl.get('screen.loginPage.studies.sectionTitle')}
          </LandingPageTitle>
        </div>
        <div className={styles.contentContainer}>
          <div className={styles.studiesData}>
            <div className={styles.titleContainer}>
              <img src={studiesSvg} />
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
          <div className={styles.carouselContainer}>
            <LoginCarousel />
          </div>
        </div>
      </div>
    </div>
  );
};

export default StudiesSection;
