import { Queries } from '../CohortBuilder/QueriesResolver';
// @ts-ignore
import filesize from 'filesize';

const formatCount = (numOrString: number | string): string => numOrString.toLocaleString();

const fromSqonValueToVariables = (content: any): any => {
  if (!content) {
    return;
  }
  return {
    sqon: content,
  };
};

const queryFileStat: string = `
  query($sqon: JSON) {
    data: file {
      hits(filters: $sqon) {
        total
      }
    }
  }
`;

const getFileStatHits = (rawData: any): string => formatCount(rawData?.data?.data?.hits?.total);

export const buildStatQueriesForFileHits = (sqonContent: Object): Queries => [
  {
    query: queryFileStat,
    variables: fromSqonValueToVariables(sqonContent),
    transform: getFileStatHits,
  },
];

const queryParticipantStat: string = `
  query($sqon: JSON) {
    data: file {
      aggregations(filters: $sqon, include_missing: false, aggregations_filter_themselves: true) {
        participants__kf_id {
          cardinality
        }
      }
    }
  }
`;

const getParticipantStatCardinality = (rawData: any): string =>
  formatCount(rawData?.data?.data?.aggregations?.participants__kf_id?.cardinality);

export const buildStatQueriesForParticipant = (sqonContent: Object): Queries => [
  {
    query: queryParticipantStat,
    variables: fromSqonValueToVariables(sqonContent),
    transform: getParticipantStatCardinality,
  },
];

const queryFamilyStat: string = `
  query($sqon: JSON) {
    data: file {
      aggregations(filters: $sqon, include_missing: false, aggregations_filter_themselves: true) {
       participants__family_id {
          cardinality
        }
      }
    }
  }
`;

const getFamilyStatCardinality = (rawData: any): string =>
  formatCount(rawData?.data?.data?.aggregations?.participants__family_id?.cardinality);

export const buildStatQueriesForFamily = (sqonContent: Object): Queries => [
  {
    query: queryFamilyStat,
    variables: fromSqonValueToVariables(sqonContent),
    transform: getFamilyStatCardinality,
  },
];

const queryFileSizeStat: string = `
query ($sqon: JSON) {
  data: file {
    aggregations(filters: $sqon, include_missing: false, aggregations_filter_themselves: true) {
      size {
        stats {
          sum
        }
      }
    }
  }
}
`;

const getFileStats = (rawData: any): string => {
  const sum = rawData?.data?.data?.aggregations?.size?.stats?.sum || 0;
  return filesize(sum).toUpperCase();
};

export const buildStatQueriesForFile = (sqonContent: Object): Queries => [
  {
    query: queryFileSizeStat,
    variables: fromSqonValueToVariables(sqonContent),
    transform: getFileStats,
  },
];
