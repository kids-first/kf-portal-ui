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
import useBiospecimenResolvedSqon from 'graphql/biospecimens/useBiospecimenResolvedSqon';
import { INDEXES } from 'graphql/constants';
import { SAMPLE_TYPE_QUERY } from 'graphql/summary/queries';
import { isEmpty } from 'lodash';
import { ARRANGER_API_PROJECT_URL } from 'provider/ApolloProvider';
import { DATA_EXPLORATION_QB_ID } from 'views/DataExploration/utils/constant';

import useApi from 'hooks/useApi';
import { truncateString } from 'utils/string';
import { getResizableGridDictionary } from 'utils/translation';

import { UID } from '../utils/grid';

const addToQuery = (field: string, key: string) =>
  updateActiveQueryField({
    queryBuilderId: DATA_EXPLORATION_QB_ID,
    field,
    value: [key.toLowerCase() === 'no data' ? ArrangerValues.missing : key],
    index: INDEXES.BIOSPECIMEN,
  });

const SampleTypeGraphCard = () => {
  const { sqon } = useBiospecimenResolvedSqon(DATA_EXPLORATION_QB_ID);
  const { loading, result } = useApi<any>({
    config: {
      url: ARRANGER_API_PROJECT_URL,
      method: 'POST',
      data: {
        query: SAMPLE_TYPE_QUERY,
        variables: { sqon },
      },
    },
  });

  const sampleTypeResults = aggregationToChartData(
    result?.data?.biospecimen?.aggregations?.sample_type.buckets,
    result?.data?.biospecimen?.hits?.total,
  )
    .sort((a, b) => a.value - b.value)
    .slice(0, 10);

  return (
    <ResizableGridCard
      gridUID={UID}
      id="sample_type"
      theme="shade"
      loading={loading}
      loadingType="spinner"
      dictionary={getResizableGridDictionary()}
      headerTitle={intl.get('screen.dataExploration.tabs.summary.availableData.sampleTypeTitle')}
      tsvSettings={{
        contentMap: ['label', 'value', 'frequency'],
        headers: ['Sample Type', 'Count', 'Frequency'],
        data: [formatAggregationChartData(sampleTypeResults)],
      }}
      modalContent={
        <BarChart
          data={sampleTypeResults}
          axisLeft={{
            legend: intl.get(
              'screen.dataExploration.tabs.summary.graphs.sampleTypeGraph.legendAxisLeft',
            ),
            legendPosition: 'middle',
            legendOffset: -110,
            format: (title: string) => truncateString(title, 15),
          }}
          tooltipLabel={(node: any) => node.data.id}
          axisBottom={{
            legend: intl.get(
              'screen.dataExploration.tabs.summary.graphs.sampleTypeGraph.legendAxisBottom',
            ),
            legendPosition: 'middle',
            legendOffset: 35,
          }}
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
          {isEmpty(sampleTypeResults) ? (
            <Empty imageType="grid" size="large" noPadding />
          ) : (
            <BarChart
              data={sampleTypeResults}
              axisLeft={{
                legend: intl.get(
                  'screen.dataExploration.tabs.summary.graphs.sampleTypeGraph.legendAxisLeft',
                ),
                legendPosition: 'middle',
                legendOffset: -110,
                format: (title: string) => truncateString(title, 15),
              }}
              tooltipLabel={(node: any) => node.data.id}
              axisBottom={{
                legend: intl.get(
                  'screen.dataExploration.tabs.summary.graphs.sampleTypeGraph.legendAxisBottom',
                ),
                legendPosition: 'middle',
                legendOffset: 35,
              }}
              onClick={(datum: any) => addToQuery('sample_type', datum.indexValue as string)}
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

export default SampleTypeGraphCard;
