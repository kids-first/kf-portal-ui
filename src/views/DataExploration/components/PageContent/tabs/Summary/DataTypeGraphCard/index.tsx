import intl from 'react-intl-universal';
import BarChart from '@ferlab/ui/core/components/Charts/Bar';
import Empty from '@ferlab/ui/core/components/Empty';
import { updateActiveQueryField } from '@ferlab/ui/core/components/QueryBuilder/utils/useQueryBuilderState';
import { ArrangerValues } from '@ferlab/ui/core/data/arranger/formatting';
import ResizableGridCard from '@ferlab/ui/core/layout/ResizableGridLayout/ResizableGridCard';
import { aggregationToChartData } from '@ferlab/ui/core/layout/ResizableGridLayout/utils';
import { INDEXES } from 'graphql/constants';
import useParticipantResolvedSqon from 'graphql/participants/useParticipantResolvedSqon';
import { DATATYPE_QUERY } from 'graphql/summary/queries';
import { isEmpty } from 'lodash';
import { ARRANGER_API_PROJECT_URL } from 'provider/ApolloProvider';
import { DATA_EXPLORATION_QB_ID } from 'views/DataExploration/utils/constant';

import useApi from 'hooks/useApi';
import { truncateString } from 'utils/string';
import { getResizableGridDictionary } from 'utils/translation';

import { DATA_TYPE_GRAPH_CARD_ID, UID } from '../utils/grid';

const addToQuery = (field: string, key: string) =>
  updateActiveQueryField({
    queryBuilderId: DATA_EXPLORATION_QB_ID,
    field,
    value: [key.toLowerCase() === 'no data' ? ArrangerValues.missing : key],
    index: INDEXES.FILE,
  });

const DataTypeGraphCard = () => {
  const { sqon } = useParticipantResolvedSqon(DATA_EXPLORATION_QB_ID);
  const { loading, result } = useApi<any>({
    config: {
      url: ARRANGER_API_PROJECT_URL,
      method: 'POST',
      data: {
        query: DATATYPE_QUERY,
        variables: { sqon },
      },
    },
  });
  const dataTypeResults = aggregationToChartData(
    result?.data?.participant?.aggregations?.files__data_type.buckets,
    result?.data?.participant?.hits?.total,
  );

  const filteredTypeResults = dataTypeResults.sort((a, b) => a.value - b.value).slice(0, 10);

  return (
    <ResizableGridCard
      gridUID={UID}
      id={DATA_TYPE_GRAPH_CARD_ID}
      dictionary={getResizableGridDictionary()}
      downloadSettings={{ png: true, svg: false, tsv: true }}
      theme="shade"
      loading={loading}
      loadingType="spinner"
      headerTitle={intl.get('screen.dataExploration.tabs.summary.availableData.dataTypeTitle')}
      tsvSettings={{
        data: [dataTypeResults],
      }}
      modalContent={
        <BarChart
          data={dataTypeResults}
          ariaLabel={intl.get('screen.dataExploration.tabs.summary.availableData.dataTypeTitle')}
          barAriaLabel={(e) => `${e.indexValue}, ${e.formattedValue} participants`}
          axisLeft={{
            legend: 'Data Types',
            legendPosition: 'middle',
            legendOffset: -128,
            format: (title: string) => truncateString(title, 15),
          }}
          tooltipLabel={(node: any) => node.data.id}
          axisBottom={{
            legend: '# of participants',
            legendPosition: 'middle',
            legendOffset: 35,
          }}
          onClick={(datum: any) => addToQuery('data_type', datum.indexValue as string)}
          margin={{
            bottom: 45,
            left: 140,
            right: 12,
            top: 12,
          }}
          layout="horizontal"
        />
      }
      modalSettings={{
        width: 800,
        height: 400,
      }}
      content={
        <>
          {isEmpty(dataTypeResults) ? (
            <Empty imageType="grid" size="large" noPadding />
          ) : (
            <BarChart
              data={filteredTypeResults}
              ariaLabel={intl.get(
                'screen.dataExploration.tabs.summary.availableData.dataTypeTitle',
              )}
              barAriaLabel={(e) => `${e.indexValue}, ${e.formattedValue} participants`}
              axisLeft={{
                legend: 'Data Types',
                legendPosition: 'middle',
                legendOffset: -128,
                format: (title: string) => truncateString(title, 15),
              }}
              tooltipLabel={(node: any) => node.data.id}
              axisBottom={{
                legend: '# of participants',
                legendPosition: 'middle',
                legendOffset: 35,
              }}
              onClick={(datum: any) => addToQuery('data_type', datum.indexValue as string)}
              margin={{
                bottom: 45,
                left: 140,
                right: 12,
                top: 12,
              }}
              layout="horizontal"
            />
          )}
        </>
      }
    />
  );
};

export default DataTypeGraphCard;
