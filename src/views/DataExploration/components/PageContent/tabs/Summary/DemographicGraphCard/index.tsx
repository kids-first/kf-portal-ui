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
import { DEMOGRAPHIC_QUERY } from 'graphql/summary/queries';
import { isEmpty } from 'lodash';
import { ARRANGER_API_PROJECT_URL } from 'provider/ApolloProvider';
import { DATA_EXPLORATION_QB_ID } from 'views/DataExploration/utils/constant';

import { getCommonColors } from 'common/charts';
import useApi from 'hooks/useApi';
import { getResizableGridDictionary } from 'utils/translation';

import { DEMOGRAPHICS_GRAPH_CARD_ID, UID } from '../utils/grid';

import styles from './index.module.scss';

const colors = getCommonColors();

const graphSetting = {
  margin: {
    top: 0,
    bottom: 8,
    left: 12,
    right: 12,
  },
};

const graphModalSettings = {
  margin: {
    top: 0,
    bottom: 150,
    left: 12,
    right: 12,
  },
};

const LEGEND_ITEM_HEIGHT = 18;

const addToQuery = (field: string, key: string) =>
  updateActiveQueryField({
    queryBuilderId: DATA_EXPLORATION_QB_ID,
    field,
    value: [key.toLowerCase() === 'no data' ? ArrangerValues.missing : key],
    index: INDEXES.PARTICIPANT,
  });

const DemographicsGraphCard = () => {
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

  const sexData = aggregationToChartData(
    result?.data?.participant?.aggregations?.sex?.buckets,
    result?.data?.participant?.hits?.total,
  );
  const raceData = aggregationToChartData(
    result?.data?.participant?.aggregations?.race?.buckets,
    result?.data?.participant?.hits?.total,
  );
  const ethnicityData = aggregationToChartData(
    result?.data?.participant?.aggregations?.ethnicity?.buckets,
    result?.data?.participant?.hits?.total,
  );
  const familyData = aggregationToChartData(
    result?.data?.participant?.aggregations?.family_type?.buckets,
    result?.data?.participant?.hits?.total,
  );

  return (
    <ResizableGridCard
      gridUID={UID}
      id={DEMOGRAPHICS_GRAPH_CARD_ID}
      dictionary={getResizableGridDictionary()}
      theme="shade"
      loading={loading}
      loadingType="spinner"
      headerTitle={intl.get('screen.dataExploration.tabs.summary.demographic.cardTitle')}
      tsvSettings={{
        data: [sexData, raceData, ethnicityData, familyData],
      }}
      modalContent={
        <Row gutter={[12, 24]} className={styles.graphRowWrapper}>
          <Col sm={12} md={12} lg={6}>
            <PieChart
              data={sexData}
              onClick={(datum) => addToQuery('sex', datum.id as string)}
              colors={colors}
              legends={[
                {
                  anchor: 'bottom',
                  translateX: 0,
                  translateY: (LEGEND_ITEM_HEIGHT * sexData.length - 1) / 2,
                  direction: 'column',
                  itemWidth: 100,
                  itemHeight: LEGEND_ITEM_HEIGHT,
                },
              ]}
              {...graphModalSettings}
            />
          </Col>
          <Col sm={12} md={12} lg={6}>
            <PieChart
              data={ethnicityData}
              onClick={(datum) => addToQuery('ethnicity', datum.id as string)}
              colors={colors}
              legends={[
                {
                  anchor: 'bottom',
                  translateX: 0,
                  translateY: (LEGEND_ITEM_HEIGHT * ethnicityData.length - 1) / 2,
                  direction: 'column',
                  itemWidth: 100,
                  itemHeight: LEGEND_ITEM_HEIGHT,
                },
              ]}
              {...graphModalSettings}
            />
          </Col>
          <Col sm={12} md={12} lg={6}>
            <PieChart
              data={raceData}
              colors={colors}
              onClick={(datum) => addToQuery('race', datum.id as string)}
              legends={[
                {
                  anchor: 'bottom',
                  translateX: 0,
                  translateY: (LEGEND_ITEM_HEIGHT * raceData.length - 1) / 2,
                  direction: 'column',
                  itemWidth: 100,
                  itemHeight: LEGEND_ITEM_HEIGHT,
                },
              ]}
              {...graphModalSettings}
            />
          </Col>
          <Col sm={12} md={12} lg={6}>
            <PieChart
              data={familyData}
              colors={colors}
              onClick={(datum) => addToQuery('family_type', datum.id as string)}
              legends={[
                {
                  anchor: 'bottom',
                  translateX: 0,
                  translateY: (LEGEND_ITEM_HEIGHT * familyData.length - 1) / 2,
                  direction: 'column',
                  itemWidth: 100,
                  itemHeight: LEGEND_ITEM_HEIGHT,
                },
              ]}
              {...graphModalSettings}
            />
          </Col>
        </Row>
      }
      modalSettings={{
        width: 1000,
        height: 600,
      }}
      content={
        <Row gutter={[12, 24]} className={styles.graphRowWrapper}>
          <Col sm={12} md={12} lg={6}>
            {isEmpty(sexData) ? (
              <Empty imageType="grid" />
            ) : (
              <PieChart
                title={intl.get('screen.dataExploration.tabs.summary.demographic.sexTitle')}
                data={sexData}
                onClick={(datum) => addToQuery('sex', datum.id as string)}
                colors={colors}
                {...graphSetting}
              />
            )}
          </Col>
          <Col sm={12} md={12} lg={6}>
            {isEmpty(ethnicityData) ? (
              <Empty imageType="grid" />
            ) : (
              <PieChart
                title={intl.get('screen.dataExploration.tabs.summary.demographic.ethnicityTitle')}
                data={ethnicityData}
                onClick={(datum) => addToQuery('ethnicity', datum.id as string)}
                colors={colors}
                {...graphSetting}
              />
            )}
          </Col>
          <Col sm={12} md={12} lg={6}>
            {isEmpty(raceData) ? (
              <Empty imageType="grid" />
            ) : (
              <PieChart
                title={intl.get('screen.dataExploration.tabs.summary.demographic.raceTitle')}
                data={raceData}
                colors={colors}
                onClick={(datum) => addToQuery('race', datum.id as string)}
                {...graphSetting}
              />
            )}
          </Col>
          <Col sm={12} md={12} lg={6}>
            {isEmpty(familyData) ? (
              <Empty imageType="grid" />
            ) : (
              <PieChart
                title={intl.get(
                  'screen.dataExploration.tabs.summary.demographic.familyComposition',
                )}
                data={familyData}
                colors={colors}
                onClick={(datum) => addToQuery('family_type', datum.id as string)}
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
