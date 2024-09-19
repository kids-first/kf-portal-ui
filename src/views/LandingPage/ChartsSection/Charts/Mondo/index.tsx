import intl from 'react-intl-universal';
import BarChart from '@ferlab/ui/core/components/Charts/Bar';
import { titleCase } from '@ferlab/ui/core/utils/stringUtils';
import GridCard from '@ferlab/ui/core/view/v2/GridCard';
import { Typography } from 'antd';

import { useGlobals } from 'store/global';

import styles from './index.module.css';

const { Title } = Typography;

const MondoChart = () => {
  const { stats } = useGlobals();
  const { diagnosis = [] } = stats || {};

  const massagedDiagnosis = diagnosis
    .map((d) => ({
      id: titleCase(d.mondo_id),
      label: titleCase(d.mondo_id),
      value: d.count,
    }))
    .reverse();

  return (
    <GridCard
      wrapperClassName={styles.wrapper}
      contentClassName={styles.contentCard}
      theme="shade"
      title={
        <Title level={4}>{intl.get('screen.loginPage.chartsSection.chart.mondo.title')}</Title>
      }
      content={
        <BarChart
          labelTextColor="white"
          colors={{ scheme: 'paired' }}
          defs={undefined}
          axisBottom={{
            tickValues: 10,
            legend: intl.get('screen.loginPage.chartsSection.chart.mondo.bottomAxis'),
            legendOffset: 35,
            legendPosition: 'middle',
          }}
          axisLeft={{
            format: (label: string) =>
              label
                .replace(/\(MONDO:\d+\)/g, '')
                .split('-')
                .pop(),
            legend: intl.get('screen.loginPage.chartsSection.chart.mondo.leftAxis'),
            legendOffset: -195,
            legendPosition: 'middle',
          }}
          padding={0.5}
          data={massagedDiagnosis}
          layout="horizontal"
          margin={{
            bottom: 45,
            left: 210,
            right: 12,
            top: 12,
          }}
          tooltipLabel={(node: any) => node.data.label}
        />
      }
    />
  );
};

export default MondoChart;
