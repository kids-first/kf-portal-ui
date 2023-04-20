import intl from 'react-intl-universal';
import Empty from '@ferlab/ui/core/components/Empty';
import { updateActiveQueryField } from '@ferlab/ui/core/components/QueryBuilder/utils/useQueryBuilderState';
import { ArrangerValues } from '@ferlab/ui/core/data/arranger/formatting';
import { TRawAggregation } from '@ferlab/ui/core/graphql/types';
import GridCard, { GridCardHeader } from '@ferlab/ui/core/view/v2/GridCard';
import { BasicTooltip } from '@nivo/tooltip';
import { Col, Row } from 'antd';
import { INDEXES } from 'graphql/constants';
import useParticipantResolvedSqon from 'graphql/participants/useParticipantResolvedSqon';
import { PARTICIPANT_BY_STUDIES_QUERY } from 'graphql/summary/queries';
import { isEmpty } from 'lodash';
import { ARRANGER_API_PROJECT_URL } from 'provider/ApolloProvider';
import { DATA_EXPLORATION_QB_ID } from 'views/DataExploration/utils/constant';

import PieChart from 'components/uiKit/charts/Pie';
import useApi from 'hooks/useApi';
import { toChartData } from 'utils/charts';

import styles from './index.module.scss';

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

const addToQuery = (field: string, key: string) =>
  updateActiveQueryField({
    queryBuilderId: DATA_EXPLORATION_QB_ID,
    field,
    value: [key.toLowerCase() === 'no data' ? ArrangerValues.missing : key],
    index: INDEXES.PARTICIPANT,
  });

const StudiesGraphCard = ({ id, className = '' }: OwnProps) => {
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
      resizable
      title={
        <GridCardHeader
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
                onClick={(datum) => addToQuery('study.study_code', datum.id as string)}
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
