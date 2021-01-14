import React from 'react';
import DataTypeChart from './DataTypeChart';
import Card from '@ferlab-ui/core-react/lib/esnext/cards/GridCard';

type DataTypeCardProps = {
  isLoading: boolean;
  dataTypesData: any[];
  experimentalStrategyData: any[];
};

const CHART_HEIGHT_PX = 350;

const DataTypeCard = ({
  isLoading,
  dataTypesData,
  experimentalStrategyData,
}: DataTypeCardProps) => (
  <Card title={<span className={'title-summary-card'}>Available Data</span>} loading={isLoading}>
    <div className={'cardBodyDataChartType'}>
      <div className={'wrapperDataTypeChart'}>
        <DataTypeChart
          data={dataTypesData}
          axisLeftLegend={'# Participants'}
          axisBottomLegend={'Data Type'}
          isLoading={isLoading}
          height={CHART_HEIGHT_PX}
        />
      </div>
      <div className={'wrapperDataTypeChart'}>
        <DataTypeChart
          data={experimentalStrategyData}
          axisLeftLegend={'# Participants'}
          axisBottomLegend={'Experimental Strategy'}
          isLoading={isLoading}
          height={CHART_HEIGHT_PX}
        />
      </div>
    </div>
  </Card>
);

export default DataTypeCard;
