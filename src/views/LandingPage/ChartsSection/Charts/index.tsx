import StudiesChart from 'views/LandingPage/ChartsSection/Charts/Demographic';
import MondoChart from 'views/LandingPage/ChartsSection/Charts/Mondo';

import styles from './index.module.css';

const StatsCharts = () => (
  <div className={styles.statsCharts}>
    <MondoChart />
    <StudiesChart />
  </div>
);

export default StatsCharts;
