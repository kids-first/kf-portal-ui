import gql from 'graphql-tag';
import { get, flatten } from 'lodash';

export const toFileSqon = participantSqon => {
  const { content } = participantSqon;
  const FILE_PREFIX = 'files';
  const PARTICIPANT_PREFIX = 'participants';
  if (Array.isArray(content)) {
    return { ...participantSqon, content: content.map(toFileSqon) };
  } else {
    const { field } = content;
    const transposedFieldName =
      field.indexOf(`${FILE_PREFIX}.`) === 0
        ? field.split(`${FILE_PREFIX}.`).join('')
        : `${PARTICIPANT_PREFIX}.${field}`;
    return { ...participantSqon, content: { ...content, field: transposedFieldName } };
  }
};

export const dataTypesExpStratPairsQuery = participantSqon => ({
  query: gql`
    query FileBreakdownQuery($sqon: JSON) {
      file {
        aggregations(aggregations_filter_themselves: true, include_missing: true, filters: $sqon) {
          sequencing_experiments__experiment_strategy {
            buckets {
              key
            }
          }
          data_type {
            buckets {
              key
            }
          }
        }
      }
    }
  `,
  variables: { sqon: toFileSqon(participantSqon) },
  transform: data => {
    const experimentStrategies = get(
      data,
      'data.file.aggregations.sequencing_experiments__experiment_strategy.buckets',
      [],
    ).map(bucket => bucket.key);

    const dataTypes = get(data, 'data.file.aggregations.data_type.buckets').map(
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

export const toFileIdsByDataTypeQuery = ({ participantSqon }) => dataType => ({
  query: gql`
    query($sqon: JSON, $dataType: String) {
      file {
        aggregations(
          aggregations_filter_themselves: true
          filters: {
            op: "and"
            content: [$sqon, { op: "in", content: { field: "data_type", value: [$dataType] } }]
          }
        ) {
          kf_id {
            buckets {
              key
            }
          }
        }
      }
    }
  `,
  variables: { dataType, sqon: toFileSqon(participantSqon) },
  transform: ({ data }) => {
    const fileIdBuckets = get(data, 'file.aggregations.kf_id.buckets', []);
    return { dataType, fileIdBuckets };
  },
});

export const toFileBreakdownQueries = ({ participantSqon }) => ({
  dataType,
  experimentalStrategy,
}) => ({
  query: gql`
    query($sqon: JSON, $dataType: String, $experimentalStrategy: String) {
      file {
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
                  field: "sequencing_experiments.experiment_strategy"
                  value: [$experimentalStrategy]
                }
              }
              { op: "in", content: { field: "data_type", value: [$dataType] } }
            ]
          }
        ) {
          kf_id {
            buckets {
              key
            }
          }
        }
      }
    }
  `,
  variables: { sqon: toFileSqon(participantSqon), dataType, experimentalStrategy },
  transform: data => {
    const files = get(data, 'data.file.aggregations.kf_id.buckets', []);

    return { dataType, experimentalStrategy, files, filesCount: files.length };
  },
});
