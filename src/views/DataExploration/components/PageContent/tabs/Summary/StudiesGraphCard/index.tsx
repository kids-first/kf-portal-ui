import PieChart from 'components/uiKit/charts/Pie';
import { toChartData } from 'utils/charts';
import intl from 'react-intl-universal';
import GridCard from '@ferlab/ui/core/view/v2/GridCard';
import { INDEXES } from 'graphql/constants';
import { useHistory } from 'react-router-dom';
import { ArrangerValues } from '@ferlab/ui/core/data/arranger/formatting';
import CardHeader from 'views/Dashboard/components/CardHeader';
import { ARRANGER_API_PROJECT_URL } from 'provider/ApolloProvider';
import { PARTICIPANT_BY_STUDIES_QUERY } from 'graphql/summary/queries';
import useApi from 'hooks/useApi';
import useParticipantResolvedSqon from 'graphql/participants/useParticipantResolvedSqon';
import { BasicTooltip } from '@nivo/tooltip';
import { isEmpty } from 'lodash';
import Empty from '@ferlab/ui/core/components/Empty';
import { DATA_EXPLORATION_QB_ID } from 'views/DataExploration/utils/constant';
import { updateActiveQueryField } from '@ferlab/ui/core/components/QueryBuilder/utils/useQueryBuilderState';

import styles from './index.module.scss';
import { Col, Row } from 'antd';
import { TRawAggregation } from '@ferlab/ui/core/graphql/types';

interface OwnProps {
  id: string;
  className?: string;
}

const transformData = (results: TRawAggregation) =>
  (results?.data?.participant?.aggregations?.study__study_code.buckets || []).map(toChartData);

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

const StudiesGraphCard = ({ id, className = '' }: OwnProps) => {
  const history = useHistory();
  const { sqon } = useParticipantResolvedSqon(DATA_EXPLORATION_QB_ID);
  const { loading, result } = useApi<any>({
    config: {
      url: ARRANGER_API_PROJECT_URL,
      method: 'POST',
      data: {
        query: PARTICIPANT_BY_STUDIES_QUERY,
        variables: { sqon },
      },
    },
  });

  const data = transformData(result);

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
          title={intl.get('screen.dataExploration.tabs.summary.studies.cardTitle')}
          withHandle
        />
      }
      content={
        <Row className={styles.graphRowWrapper}>
          <Col md={24}>
            {isEmpty(data) ? (
              <Empty imageType="grid" />
            ) : (
              <PieChart
                data={data}
                onClick={(datum) => addToQuery('study__study_code', datum.id as string, history)}
                tooltip={(value) => (
                  <BasicTooltip
                    id={value.datum.id.toString()}
                    value={value.datum.value}
                    color={value.datum.color}
                  />
                )}
                {...graphSetting}
              />
            )}
          </Col>
        </Row>
      }
    />
  );
};

export default StudiesGraphCard;
