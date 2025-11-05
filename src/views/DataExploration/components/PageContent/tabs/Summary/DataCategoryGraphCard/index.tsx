import intl from 'react-intl-universal';
import BarChart from '@ferlab/ui/core/components/Charts/Bar';
import Empty from '@ferlab/ui/core/components/Empty';
import { updateActiveQueryField } from '@ferlab/ui/core/components/QueryBuilder/utils/useQueryBuilderState';
import { ArrangerValues } from '@ferlab/ui/core/data/arranger/formatting';
import ResizableGridCard from '@ferlab/ui/core/layout/ResizableGridLayout/ResizableGridCard';
import {
  aggregationToChartData,
  formatAggregationChartData,
} from '@ferlab/ui/core/layout/ResizableGridLayout/utils';
import { INDEXES } from 'graphql/constants';
import useFileResolvedSqon from 'graphql/files/useFileResolvedSqon';
import { DATA_CATEGORY_QUERY } from 'graphql/summary/queries';
import { isEmpty } from 'lodash';
import { ARRANGER_API_PROJECT_URL } from 'provider/ApolloProvider';
import { DATA_EXPLORATION_QB_ID } from 'views/DataExploration/utils/constant';

import useApi from 'hooks/useApi';
import { truncateString } from 'utils/string';
import { getResizableGridDictionary } from 'utils/translation';

import { DATA_CATEGORY_GRAPH_CARD_ID, UID } from '../utils/grid';

const addToQuery = (field: string, key: string) =>
  updateActiveQueryField({
    queryBuilderId: DATA_EXPLORATION_QB_ID,
    field,
    value: [key.toLowerCase() === 'no data' ? ArrangerValues.missing : key],
    index: INDEXES.FILE,
  });

const DataCategoryGraphCard = () => {
  const { sqon } = useFileResolvedSqon(DATA_EXPLORATION_QB_ID);
  const { loading, result } = useApi<any>({
    config: {
      url: ARRANGER_API_PROJECT_URL,
      method: 'POST',
      data: {
        query: DATA_CATEGORY_QUERY,
        variables: { sqon },
      },
    },
  });

  const dataCategoryResults = aggregationToChartData(
    result?.data?.file?.aggregations?.data_category.buckets,
    result?.data?.file?.hits?.total,
  )
    .sort((a, b) => a.value - b.value)
    .slice(0, 10);

  return (
    <ResizableGridCard
      gridUID={UID}
      id={DATA_CATEGORY_GRAPH_CARD_ID}
      theme="shade"
      loading={loading}
      loadingType="spinner"
      dictionary={getResizableGridDictionary()}
      downloadSettings={{ png: true, svg: false, tsv: true }}
      headerTitle={intl.get('screen.dataExploration.tabs.summary.availableData.dataCategoryTitle')}
      tsvSettings={{
        contentMap: ['label', 'value', 'frequency'],
        headers: ['Data Category', 'Count', 'Frequency'],
        data: [formatAggregationChartData(dataCategoryResults)],
      }}
      modalContent={
        <BarChart
          ariaLabel={intl.get(
            'screen.dataExploration.tabs.summary.availableData.dataCategoryTitle',
          )}
          barAriaLabel={(e) => `${e.indexValue}, ${e.formattedValue} files`}
          data={dataCategoryResults}
          axisLeft={{
            legend: 'Data Categories',
            legendPosition: 'middle',
            legendOffset: -110,
            format: (title: string) => truncateString(title, 15),
          }}
          tooltipLabel={(node: any) => node.data.id}
          axisBottom={{
            legend: '# of files',
            legendPosition: 'middle',
            legendOffset: 35,
          }}
          onClick={(datum: any) => addToQuery('data_category', datum.indexValue as string)}
          layout="horizontal"
          margin={{
            bottom: 45,
            left: 125,
            right: 12,
            top: 12,
          }}
        />
      }
      modalSettings={{
        width: 800,
        height: 300,
      }}
      content={
        <>
          {isEmpty(dataCategoryResults) ? (
            <Empty imageType="grid" size="large" noPadding />
          ) : (
            <BarChart
              data={dataCategoryResults}
              ariaLabel={intl.get(
                'screen.dataExploration.tabs.summary.availableData.dataCategoryTitle',
              )}
              barAriaLabel={(e) => `${e.indexValue}, ${e.formattedValue} files`}
              axisLeft={{
                legend: 'Data Categories',
                legendPosition: 'middle',
                legendOffset: -110,
                format: (title: string) => truncateString(title, 15),
              }}
              tooltipLabel={(node: any) => node.data.id}
              axisBottom={{
                legend: '# of files',
                legendPosition: 'middle',
                legendOffset: 35,
              }}
              onClick={(datum: any) => addToQuery('data_category', datum.indexValue as string)}
              layout="horizontal"
              margin={{
                bottom: 45,
                left: 125,
                right: 12,
                top: 12,
              }}
            />
          )}
        </>
      }
    />
  );
};

export default DataCategoryGraphCard;
