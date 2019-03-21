import gql from 'graphql-tag';
import { get, flatten } from 'lodash';

export const toFileBreakdownQueries = ({ sqon, dataType, experimentalStrategy }) => ({
  query: gql`
    query($sqon: JSON, $dataType: String, $experimentalStrategy: String) {
      participant {
        aggregations(
          aggregations_filter_themselves: true
          include_missing: true
          filters: {
            op: "and"
            content: [
              $sqon
              {
                op: "in"
                content: {
                  field: "files.sequencing_experiments.experiment_strategy"
                  value: [$experimentalStrategy]
                }
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
    const files = get(data, 'data.participant.aggregations.files__kf_id.buckets', []);

    return { dataType, experimentalStrategy, files, filesCount: files.length };
  },
});

export const dataTypesExpStratPairsQuery = sqon => ({
  query: gql`
    query FileBreakdownQuery($sqon: JSON) {
      participant {
        aggregations(aggregations_filter_themselves: true, include_missing: true, filters: $sqon) {
          files__sequencing_experiments__experiment_strategy {
            buckets {
              key
            }
          }
          files__data_type {
            buckets {
              key
            }
          }
        }
      }
    }
  `,
  variables: { sqon },
  transform: data => {
    const experimentStrategies = get(
      data,
      'data.participant.aggregations.files__sequencing_experiments__experiment_strategy.buckets',
      [],
    ).map(bucket => bucket.key);

    const dataTypes = get(data, 'data.participant.aggregations.files__data_type.buckets').map(
      bucket => bucket.key,
    );

    const pairs = flatten(
      dataTypes.map(dataType =>
        experimentStrategies.map(experimentalStrategy => ({
          dataType,
          experimentalStrategy,
        })),
      ),
    );
    return pairs;
  },
});
