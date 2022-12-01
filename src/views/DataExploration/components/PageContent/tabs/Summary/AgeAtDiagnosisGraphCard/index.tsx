import BarChart from 'components/uiKit/charts/Bar';
import GridCard from '@ferlab/ui/core/view/v2/GridCard';
import { INDEXES } from 'graphql/constants';
import { ArrangerValues } from '@ferlab/ui/core/data/arranger/formatting';
import { isEmpty } from 'lodash';
import Empty from '@ferlab/ui/core/components/Empty';
import { AGE_AT_DIAGNOSIS_QUERY } from 'graphql/summary/queries';
import { ARRANGER_API_PROJECT_URL } from 'provider/ApolloProvider';
import useApi from 'hooks/useApi';
import useParticipantResolvedSqon from 'graphql/participants/useParticipantResolvedSqon';
import CardHeader from 'views/Dashboard/components/CardHeader';
import intl from 'react-intl-universal';
import { DATA_EXPLORATION_QB_ID } from 'views/DataExploration/utils/constant';
import { updateActiveQueryField } from '@ferlab/ui/core/components/QueryBuilder/utils/useQueryBuilderState';
import { RangeOperators } from '@ferlab/ui/core/data/sqon/operators';

interface OwnProps {
  id: string;
  className?: string;
}

type DiagnosisQueryResult = {
  data: {
    [key: string]: {
      [key: string]: {
        total: number;
      };
    };
  };
};

const transformAgeAtDiagnosis = (results: DiagnosisQueryResult) =>
  Object.keys(results?.data?.participant || {}).map((key) => ({
    id: intl.get(`screen.dataExploration.tabs.summary.ageAtDiagnosis.${key}`),
    label: key,
    value: results?.data?.participant[key]?.total || 0,
  }));

const graphSetting: any = {
  height: 300,
  margin: {
    bottom: 45,
    left: 125,
  },
  enableLabel: false,
  layout: 'vertical',
};

const buildSqonFromRange = (rangeValue: string) => {
  switch (rangeValue) {
    case '_0to1':
      return {
        op: RangeOperators['<='],
        value: [364],
      };

    case '_1to5':
      return {
        op: RangeOperators['between'],
        value: [365, 1824],
      };
    case '_5to10':
      return {
        op: RangeOperators['between'],
        value: [1825, 3649],
      };

    case '_10to15':
      return {
        op: RangeOperators['between'],
        value: [3650, 5474],
      };
    case '_15to18':
      return {
        op: RangeOperators['between'],
        value: [5475, 6569],
      };

    case '_18plus':
      return {
        op: RangeOperators['>='],
        value: [6570],
      };
    default:
      return {
        op: undefined,
        value: [ArrangerValues.missing],
      };
  }
};

const addToQuery = (field: string, key: string) => {
  const sqon = buildSqonFromRange(key);
  return updateActiveQueryField({
    queryBuilderId: DATA_EXPLORATION_QB_ID,
    field,
    value: sqon.value,
    operator: sqon.op,
    index: INDEXES.PARTICIPANT,
  });
};

const AgeAtDiagnosisGraphCard = ({ id, className = '' }: OwnProps) => {
  const { sqon } = useParticipantResolvedSqon(DATA_EXPLORATION_QB_ID);
  const { loading, result } = useApi<any>({
    config: {
      url: ARRANGER_API_PROJECT_URL,
      method: 'POST',
      data: {
        query: AGE_AT_DIAGNOSIS_QUERY,
        variables: { sqon },
      },
    },
  });

  const ageAtDiagnosisresults = transformAgeAtDiagnosis(result);

  return (
    <GridCard
      wrapperClassName={className}
      theme="shade"
      loading={loading}
      loadingType="spinner"
      title={
        <CardHeader
          id={id}
          title={intl.get('screen.dataExploration.tabs.summary.ageAtDiagnosis.cardTitle')}
          withHandle
        />
      }
      content={
        <>
          {isEmpty(ageAtDiagnosisresults) ? (
            <Empty imageType="grid" size="large" />
          ) : (
            <BarChart
              showCursor
              data={ageAtDiagnosisresults}
              tooltipLabel={(node: any) => `Participant${node.data.value > 1 ? 's' : ''}`}
              axisLeft={{
                legend: '# Participants',
                legendPosition: 'middle',
                legendOffset: -45,
              }}
              axisBottom={{
                legend: 'Age at Diagnosis (years)',
                legendPosition: 'middle',
                legendOffset: 35,
              }}
              onClick={(datum: any) =>
                addToQuery('diagnosis.age_at_event_days', datum.data.label as string)
              }
              {...graphSetting}
            />
          )}
        </>
      }
    />
  );
};

export default AgeAtDiagnosisGraphCard;
