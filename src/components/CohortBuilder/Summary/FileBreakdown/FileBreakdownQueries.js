import gql from 'graphql-tag';
import { get } from 'lodash';

/**
 * Queries:
 * - Get all File Data Types from Summary index
 * - Get all Experimental Strategies
 * - Get total file counts for each combination of file data type / experimental strategy (rows)
 */
const toFileBreakdownQueries = ({ sqon, dataType, experimentalStrategy }) => ({
  query: gql`
    query($sqon: JSON, $dataType: String, $experimentalStrategy: String) {
      participant {
        aggregations(
          filters: {
            op: "and"
            content: [
              $sqon
              {
                op: "in"
                content: { field: "files.experiment_strategies", value: [$experimentalStrategy] }
              }
              { op: "in", content: { field: "files.data_type", value: [$dataType] } }
            ]
          }
        ) {
          files__kf_id {
            buckets {
              doc_count
              key
            }
          }
        }
      }
    }
  `,
  variables: { sqon, dataType, experimentalStrategy },
  transform: data => {
    const files = get(data, 'data.participant.aggregations.files__kf_id.buckets', []).length;

    return {
      dataType,
      experimentalStrategy,
      files,
    };
  },
});

export const toExpStratQueries = ({ fileDataTypes, sqon }) =>
  fileDataTypes.map(dataType => ({
    query: gql`
      query($sqon: JSON, $dataType: String) {
        participant {
          aggregations(
            aggregations_filter_themselves: true
            filters: {
              op: "and"
              content: [
                $sqon
                { op: "in", content: { field: "files.data_type", value: [$dataType] } }
              ]
            }
          ) {
            files__experiment_strategies {
              buckets {
                key
              }
            }
          }
        }
      }
    `,
    variables: { sqon, dataType },
    transform: data => {
      /**
       * Return complete file breakdown queries
       * - each combination of file data type and file experimental strategy
       */
      const expStratBuckets = get(
        data,
        'data.participant.aggregations.files__experiment_strategies.buckets',
        [],
      );

      const fileBreakdownQueries = expStratBuckets.map(strategy =>
        toFileBreakdownQueries({
          sqon,
          dataType,
          experimentalStrategy: strategy.key,
        }),
      );

      return fileBreakdownQueries;
    },
  }));
