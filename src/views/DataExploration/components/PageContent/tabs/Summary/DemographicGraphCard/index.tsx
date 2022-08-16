import { Col, Row } from 'antd';
import { RawAggregation } from 'graphql/models';
import PieChart from 'components/uiKit/charts/Pie';
import { toChartData } from 'utils/charts';
import intl from 'react-intl-universal';
import GridCard from '@ferlab/ui/core/view/v2/GridCard';
import { INDEXES } from 'graphql/constants';
import { useHistory } from 'react-router-dom';
import { ArrangerValues } from '@ferlab/ui/core/data/arranger/formatting';
import CardHeader from 'views/Dashboard/components/CardHeader';
import { ARRANGER_API_PROJECT_URL } from 'provider/ApolloProvider';
import { DEMOGRAPHIC_QUERY } from 'graphql/summary/queries';
import useApi from 'hooks/useApi';
import useParticipantResolvedSqon from 'graphql/participants/useParticipantResolvedSqon';
import { BasicTooltip } from '@nivo/tooltip';
import { capitalize, isEmpty } from 'lodash';
import Empty from '@ferlab/ui/core/components/Empty';
import { DATA_EXPLORATION_QB_ID } from 'views/DataExploration/utils/constant';
import { updateActiveQueryField } from '@ferlab/ui/core/components/QueryBuilder/utils/useQueryBuilderState';

import styles from './index.module.scss';

interface OwnProps {
  id: string;
  className?: string;
}

const transformData = (results: RawAggregation) => {
  const aggs = results?.data?.participant?.aggregations;
  return {
    race: (aggs?.race.buckets || []).map(toChartData),
    sex: (aggs?.sex.buckets || []).map(toChartData),
    ethnicity: (aggs?.ethnicity.buckets || []).map(toChartData),
  };
};

const graphSetting = {
  height: 175,
  margin: {
    top: 12,
    bottom: 12,
    left: 12,
    right: 12,
  },
};

const addToQuery = (field: string, key: string, history: any) =>
  updateActiveQueryField({
    queryBuilderId: DATA_EXPLORATION_QB_ID,
    field,
    value: [key.toLowerCase() === 'no data' ? ArrangerValues.missing : key],
    index: INDEXES.PARTICIPANT,
  });

const DemographicsGraphCard = ({ id, className = '' }: OwnProps) => {
  const history = useHistory();
  const { sqon } = useParticipantResolvedSqon(DATA_EXPLORATION_QB_ID);
  const { loading, result } = useApi<any>({
    config: {
      url: ARRANGER_API_PROJECT_URL,
      method: 'POST',
      data: {
        query: DEMOGRAPHIC_QUERY,
        variables: { sqon },
      },
    },
  });

  const sexData = result ? transformData(result).sex : [];
  const raceData = result ? transformData(result).race : [];
  const enthicityData = result ? transformData(result).ethnicity : [];

  return (
    <GridCard
      wrapperClassName={className}
      contentClassName={styles.graphContentWrapper}
      theme="shade"
      loading={loading}
      loadingType="spinner"
      title={
        <CardHeader
          id={id}
          title={intl.get('screen.dataExploration.tabs.summary.demographic.cardTitle')}
          withHandle
        />
      }
      content={
        <Row gutter={[12, 24]} className={styles.graphRowWrapper}>
          <Col sm={12} md={12} lg={8}>
            {isEmpty(sexData) ? (
              <Empty imageType="grid" />
            ) : (
              <PieChart
                title={intl.get('screen.dataExploration.tabs.summary.demographic.sexTitle')}
                data={sexData}
                onClick={(datum) => addToQuery('sex', datum.id as string, history)}
                tooltip={(value) => (
                  <BasicTooltip
                    id={capitalize(value.datum.id.toString())}
                    value={value.datum.value}
                    color={value.datum.color}
                  />
                )}
                {...graphSetting}
              />
            )}
          </Col>
          <Col sm={12} md={12} lg={8}>
            {isEmpty(raceData) ? (
              <Empty imageType="grid" />
            ) : (
              <PieChart
                title={intl.get('screen.dataExploration.tabs.summary.demographic.raceTitle')}
                data={raceData}
                onClick={(datum) => addToQuery('race', datum.id as string, history)}
                {...graphSetting}
              />
            )}
          </Col>
          <Col sm={12} md={12} lg={8}>
            {isEmpty(enthicityData) ? (
              <Empty imageType="grid" />
            ) : (
              <PieChart
                title={intl.get('screen.dataExploration.tabs.summary.demographic.ethnicityTitle')}
                data={enthicityData}
                onClick={(datum) => addToQuery('ethnicity', datum.id as string, history)}
                {...graphSetting}
              />
            )}
          </Col>
        </Row>
      }
    />
  );
};

export default DemographicsGraphCard;
