import intl from 'react-intl-universal';
import PieChart from '@ferlab/ui/core/components/Charts/Pie';
import GridCard from '@ferlab/ui/core/view/v2/GridCard';
import { Typography } from 'antd';

import { getCommonColors } from 'common/charts';
import { useGlobals } from 'store/global';

import styles from './index.module.css';

const { Title } = Typography;

const graphSetting = {
  margin: {
    bottom: 8,
    top: 8,
    left: 12,
    right: 12,
  },
};

const colors = getCommonColors();

const StudiesChart = () => {
  const { stats } = useGlobals();
  const { sex, race } = stats || {};

  const sexData = [];
  for (const key in sex) {
    sexData.push({
      id: key,
      label: key,
      value: sex[key],
    });
  }

  const raceData = [];
  for (const key in race) {
    raceData.push({
      id: key,
      label: key,
      value: race[key],
    });
  }

  return (
    <GridCard
      wrapperClassName={styles.wrapper}
      contentClassName={styles.contentCard}
      theme="shade"
      title={
        <Title level={4}>{intl.get('screen.loginPage.chartsSection.chart.demographics')}</Title>
      }
      content={
        <div className={styles.chartRowWrapper}>
          <PieChart
            title={intl.get('screen.loginPage.chartsSection.chart.familyComposition')}
            data={sexData}
            colors={colors}
            {...graphSetting}
          />
          <PieChart
            title={intl.get('screen.dataExploration.tabs.summary.demographic.ethnicityTitle')}
            data={[]}
            colors={colors}
            {...graphSetting}
          />
          <PieChart
            title={intl.get('screen.loginPage.chartsSection.chart.race')}
            data={raceData}
            colors={colors}
            {...graphSetting}
          />
        </div>
      }
    />
  );
};

export default StudiesChart;
