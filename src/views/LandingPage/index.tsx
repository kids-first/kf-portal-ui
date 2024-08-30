import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import ChartsSection from 'views/LandingPage/ChartsSection';
import CollaboratorSection from 'views/LandingPage/CollaboratorSection';
import Footer from 'views/LandingPage/Footer';
import StudiesSection from 'views/LandingPage/StudiesSection';
import TopBanner from 'views/LandingPage/TopBanner';

import { fetchStats } from 'store/global/thunks';

import styles from './index.module.css';

const LandingPage = (): React.ReactElement => {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(fetchStats());
  }, []);

  return (
    <div className={styles.mainLayout}>
      <TopBanner />
      <StudiesSection />
      <ChartsSection />
      <CollaboratorSection />
      <Footer />
    </div>
  );
};

export default LandingPage;
