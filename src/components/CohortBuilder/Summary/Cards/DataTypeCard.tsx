import React from 'react';
import DataTypeChart from './DataTypeChart';
import Card from '@ferlab-ui/core-react/lib/esnext/cards/GridCard';

type DataTypeCardProps = {
  isLoading: boolean;
  dataTypesData: any[];
  experimentalStrategyData: any[];
};

const DataTypeCard = ({
  isLoading,
  dataTypesData,
  experimentalStrategyData,
}: DataTypeCardProps) => (
  <Card title="Available Data" loading={isLoading}>
    <div className={'cardBodyDataChartType'}>
      <div className={'wrapperDataTypeChart'}>
        <DataTypeChart
          data={dataTypesData}
          axisLeftLegend={'# Participants'}
          axisBottomLegend={'Data Type'}
          isLoading={isLoading}
          height={350}
        />
      </div>
      <div className={'wrapperDataTypeChart'}>
        <DataTypeChart
          data={experimentalStrategyData}
          axisLeftLegend={'# Participants'}
          axisBottomLegend={'Experimental Strategy'}
          isLoading={isLoading}
          height={350}
        />
      </div>
    </div>
  </Card>
);

export default DataTypeCard;
