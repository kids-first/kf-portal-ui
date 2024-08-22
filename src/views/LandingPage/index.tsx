import ChartsSection from 'views/LandingPage/ChartsSection';
import CollaboratorSection from 'views/LandingPage/CollaboratorSection';
import Footer from 'views/LandingPage/Footer';
import StudiesSection from 'views/LandingPage/StudiesSection';
import TopBanner from 'views/LandingPage/TopBanner';

import styles from './index.module.css';

const LandingPage = (): React.ReactElement => (
  <div className={styles.mainLayout}>
    <TopBanner />
    <StudiesSection />
    <ChartsSection />
    <CollaboratorSection />
    <Footer />
  </div>
);
export default LandingPage;
