import { get } from 'lodash';
import gql from 'graphql-tag';

const toGqlFieldPath = fieldPath => fieldPath.replace(/\./g, '__');

const getBuckets = searchFields =>
  searchFields
    .map(toGqlFieldPath)
    .reduce((acc, gqlFieldName) => `${acc} ${gqlFieldName} { buckets { doc_count key } }`, '');

export const searchAllFieldsQuery = (sqon, searchFields) => ({
  query: gql`
    query($sqon: JSON) {
      participant {
        aggregations(filters: $sqon) {
          ${getBuckets(searchFields)}
        }
      }
    }
  `,
  variables: { sqon },
  transform: data => get(data, 'data.participant.aggregations'),
});
