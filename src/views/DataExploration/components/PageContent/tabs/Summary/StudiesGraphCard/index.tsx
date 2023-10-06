import intl from 'react-intl-universal';
import PieChart from '@ferlab/ui/core/components/Charts/Pie';
import Empty from '@ferlab/ui/core/components/Empty';
import { updateActiveQueryField } from '@ferlab/ui/core/components/QueryBuilder/utils/useQueryBuilderState';
import { ArrangerValues } from '@ferlab/ui/core/data/arranger/formatting';
import ResizableGridCard from '@ferlab/ui/core/layout/ResizableGridLayout/ResizableGridCard';
import { aggregationToChartData } from '@ferlab/ui/core/layout/ResizableGridLayout/utils';
import { Col, Row } from 'antd';
import { INDEXES } from 'graphql/constants';
import useParticipantResolvedSqon from 'graphql/participants/useParticipantResolvedSqon';
import { PARTICIPANT_BY_STUDIES_QUERY } from 'graphql/summary/queries';
import { isEmpty } from 'lodash';
import { ARRANGER_API_PROJECT_URL } from 'provider/ApolloProvider';
import { DATA_EXPLORATION_QB_ID } from 'views/DataExploration/utils/constant';

import { getCommonColors } from 'common/charts';
import useApi from 'hooks/useApi';
import { getResizableGridDictionary } from 'utils/translation';

import { STUDIES_GRAPH_CARD_ID, UID } from '../utils/grid';

import styles from './index.module.scss';

const colors = getCommonColors();

const addToQuery = (field: string, key: string) =>
  updateActiveQueryField({
    queryBuilderId: DATA_EXPLORATION_QB_ID,
    field,
    value: [key.toLowerCase() === 'no data' ? ArrangerValues.missing : key],
    index: INDEXES.PARTICIPANT,
  });

const StudiesGraphCard = () => {
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

  const data = aggregationToChartData(
    result?.data?.participant?.aggregations?.study__study_code.buckets,
    result?.data?.participant?.hits?.total,
  );

  return (
    <ResizableGridCard
      gridUID={UID}
      id={STUDIES_GRAPH_CARD_ID}
      dictionary={getResizableGridDictionary()}
      contentClassName={styles.graphContentWrapper}
      theme="shade"
      loading={loading}
      loadingType="spinner"
      headerTitle={intl.get('screen.dataExploration.tabs.summary.studies.cardTitle')}
      tsvSettings={{
        data: [data],
      }}
      modalContent={
        <PieChart
          data={data}
          colors={colors}
          margin={{
            top: 12,
            bottom: 96,
            left: 12,
            right: 12,
          }}
          legends={[
            {
              anchor: 'bottom',
              translateX: -310,
              translateY: 92,
              direction: 'column',
              itemWidth: 100,
              itemHeight: 15,
              itemsSpacing: 2,
            },
          ]}
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
                colors={colors}
              />
            )}
          </Col>
        </Row>
      }
    />
  );
};

export default StudiesGraphCard;
