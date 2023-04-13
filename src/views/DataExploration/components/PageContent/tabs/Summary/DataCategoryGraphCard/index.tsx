import intl from 'react-intl-universal';
import { useHistory } from 'react-router-dom';
import Empty from '@ferlab/ui/core/components/Empty';
import { updateActiveQueryField } from '@ferlab/ui/core/components/QueryBuilder/utils/useQueryBuilderState';
import { ArrangerValues } from '@ferlab/ui/core/data/arranger/formatting';
import { TRawAggregation } from '@ferlab/ui/core/graphql/types';
import GridCard, { GridCardHeader } from '@ferlab/ui/core/view/v2/GridCard';
import { INDEXES } from 'graphql/constants';
import useParticipantResolvedSqon from 'graphql/participants/useParticipantResolvedSqon';
import { DATA_CATEGORY_QUERY } from 'graphql/summary/queries';
import { isEmpty } from 'lodash';
import { ARRANGER_API_PROJECT_URL } from 'provider/ApolloProvider';
import { DATA_EXPLORATION_QB_ID } from 'views/DataExploration/utils/constant';

import BarChart from 'components/uiKit/charts/Bar';
import useApi from 'hooks/useApi';
import { toChartData } from 'utils/charts';
import { truncateString } from 'utils/string';

interface OwnProps {
  id: string;
  className?: string;
}

const transformDataCategory = (results: TRawAggregation) =>
  (results?.data?.participant?.aggregations?.files__data_category.buckets || []).map(toChartData);

const graphSetting: any = {
  height: 294,
  margin: {
    bottom: 45,
    left: 125,
  },
  enableLabel: false,
  layout: 'horizontal',
};

const addToQuery = (field: string, key: string, history: any) =>
  updateActiveQueryField({
    queryBuilderId: DATA_EXPLORATION_QB_ID,
    field,
    value: [key.toLowerCase() === 'no data' ? ArrangerValues.missing : key],
    index: INDEXES.FILES,
  });

const DataCategoryGraphCard = ({ id, className = '' }: OwnProps) => {
  const history = useHistory();
  const { sqon } = useParticipantResolvedSqon(DATA_EXPLORATION_QB_ID);
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
  const dataCategoryResults = transformDataCategory(result);

  return (
    <GridCard
      wrapperClassName={className}
      theme="shade"
      loading={loading}
      loadingType="spinner"
      resizable
      title={
        <GridCardHeader
          id={id}
          title={intl.get('screen.dataExploration.tabs.summary.availableData.dataCategoryTitle')}
          withHandle
        />
      }
      content={
        <>
          {isEmpty(dataCategoryResults) ? (
            <Empty imageType="grid" size="large" />
          ) : (
            <BarChart
              data={dataCategoryResults}
              axisLeft={{
                legend: 'Data Category',
                legendPosition: 'middle',
                legendOffset: -120,
                format: (title: string) => truncateString(title, 15),
              }}
              tooltipLabel={(node: any) => node.data.id}
              axisBottom={{
                legend: '# of participants',
                legendPosition: 'middle',
                legendOffset: 35,
              }}
              onClick={(datum: any) =>
                addToQuery('data_category', datum.indexValue as string, history)
              }
              {...graphSetting}
            />
          )}
        </>
      }
    />
  );
};

export default DataCategoryGraphCard;
