import { ResponsiveBar, BarSvgProps, BarDatum } from '@nivo/bar';
import { Typography } from 'antd';
import { getCommonColors } from 'common/charts';

import styles from './index.module.scss';

type OwnProps = Omit<BarSvgProps<BarDatum>, 'width' | 'height'> & {
  title?: string;
  height: number;
};

const { Title } = Typography;

const BarChart = ({ title, height, ...rest }: OwnProps) => {
  return (
    <div className={styles.barChartWrapper}>
      {title && <Title level={5}>{title}</Title>}
      <div className={styles.chartWrapper} style={{ height: height }}>
        <ResponsiveBar
          {...rest}
          colors={rest.colors || getCommonColors()}
          colorBy="indexValue"
          onMouseEnter={(_, e: any) => {
            if (rest.onMouseEnter) {
              rest.onMouseEnter(_, e);
            }
            e.target.style.cursor = 'pointer';
          }}
        />
      </div>
    </div>
  );
};

export default BarChart;
