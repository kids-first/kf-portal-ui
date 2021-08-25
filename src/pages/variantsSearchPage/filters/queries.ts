import { gql } from '@apollo/client';

import { MappingResults } from 'store/graphql/utils/actions';

export const VARIANT_QUERY = (aggList: string[], mappingResults: MappingResults) => {
  if (mappingResults.loadingMapping) return gql``;
  else {
    return gql`
      query VariantInformation($sqon: JSON, $first: Int, $offset: Int) {
        variants {
          hits(filters: $sqon, first: $first, offset: $offset) {
            edges {
              node {
                id
                variant_class
                consequences {
                  hits {
                    edges {
                      node {
                        consequences
                      }
                    }
                  }
                }
              }
            }
          }
           aggregations (filters: $sqon){
            ${aggList.map(
              (f) =>
                f +
                ' {\n          buckets {\n            key\n            doc_count\n          }\n        }',
            )}
          }
        }
      }
    `;
  }
};
