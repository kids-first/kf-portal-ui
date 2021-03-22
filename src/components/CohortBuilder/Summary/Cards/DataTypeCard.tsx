import React from 'react';
import DataTypeChart from './DataTypeChart';
import Card from '@ferlab/ui/core/view/GridCard';
import Empty, { SIZE } from 'components/UI/Empty';

type DataTypeCardProps = {
  isLoading: boolean;
  dataTypesData: any[];
  experimentalStrategyData: any[];
};

const CHART_HEIGHT_PX = 350;

const DataTypeCard = ({
  isLoading,
  dataTypesData = [],
  experimentalStrategyData = [],
}: DataTypeCardProps) => {
  const allData = [dataTypesData, experimentalStrategyData];
  const bothChartsHaveData = allData.every((arr) => arr.length > 0);
  if (bothChartsHaveData) {
    return (
      <Card
        title={<span className={'title-summary-card'}>Available Data</span>}
        loading={isLoading}
      >
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
  }

  const indexOfChartWithData = allData.findIndex((arr) => arr.length > 0);
  if (indexOfChartWithData > -1) {
    const axisBottomLegend = dataTypesData.length === 0 ? 'Experimental Strategy' : 'Data Type';
    return (
      <Card
        title={<span className={'title-summary-card'}>Available Data</span>}
        loading={isLoading}
      >
        <div className={'cardBodyDataChartType'}>
          <DataTypeChart
            data={allData[indexOfChartWithData]}
            axisLeftLegend={'# Participants'}
            axisBottomLegend={axisBottomLegend}
            isLoading={isLoading}
            height={CHART_HEIGHT_PX}
          />
        </div>
      </Card>
    );
  }

  //both empty
  return (
    <Card title={<span className={'title-summary-card'}>Available Data</span>} loading={isLoading}>
      <div className={'empty-graph'}>
        <Empty size={SIZE.SMALL} />
      </div>
    </Card>
  );
};

export default DataTypeCard;
