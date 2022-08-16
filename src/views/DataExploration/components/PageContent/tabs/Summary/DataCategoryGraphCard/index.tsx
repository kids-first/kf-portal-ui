import { RawAggregation } from 'graphql/models';
import { toChartData } from 'utils/charts';
import BarChart from 'components/uiKit/charts/Bar';
import GridCard from '@ferlab/ui/core/view/v2/GridCard';
import { truncateString } from 'utils/string';
import { INDEXES } from 'graphql/constants';
import { useHistory } from 'react-router-dom';
import { ArrangerValues } from '@ferlab/ui/core/data/arranger/formatting';
import { isEmpty } from 'lodash';
import Empty from '@ferlab/ui/core/components/Empty';
import { DATA_CATEGORY_QUERY } from 'graphql/summary/queries';
import { ARRANGER_API_PROJECT_URL } from 'provider/ApolloProvider';
import useApi from 'hooks/useApi';
import useParticipantResolvedSqon from 'graphql/participants/useParticipantResolvedSqon';
import CardHeader from 'views/Dashboard/components/CardHeader';
import intl from 'react-intl-universal';
import { DATA_EXPLORATION_QB_ID } from 'views/DataExploration/utils/constant';
import { updateActiveQueryField } from '@ferlab/ui/core/components/QueryBuilder/utils/useQueryBuilderState';

interface OwnProps {
  id: string;
  className?: string;
}

const transformDataCategory = (results: RawAggregation) =>
  (results?.data?.participant?.aggregations?.files__data_category.buckets || []).map(toChartData);

const graphSetting: any = {
  height: 300,
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
    index: INDEXES.FILE,
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
      title={
        <CardHeader
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
              tooltipLabel={(node) => node.data.id}
              axisBottom={{
                legend: '# of participants',
                legendPosition: 'middle',
                legendOffset: 35,
              }}
              onClick={(datum) => addToQuery('data_category', datum.indexValue as string, history)}
              {...graphSetting}
            />
          )}
        </>
      }
    />
  );
};

export default DataCategoryGraphCard;
