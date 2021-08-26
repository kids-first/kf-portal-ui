import { gql } from '@apollo/client';

import { ExtendedMapping, MappingResults } from 'store/graphql/utils/actions';

import { dotToUnderscore, underscoreToDot } from '../../../store/graphql/utils';

export const VARIANT_QUERY = (aggList: string[], mappingResults: MappingResults) => {
  if (!mappingResults || mappingResults.loadingMapping) return gql``;

  const aggListDotNotation = aggList.map((i) => underscoreToDot(i));

  const extendedMappingsFields = aggListDotNotation.flatMap((i) =>
    (mappingResults?.extendedMapping || []).filter((e) => e.field === i),
  );

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
            ${generateAggregations(extendedMappingsFields)}
          }
        }
      }
    `;
};

const generateAggregations = (extendedMappingFields: ExtendedMapping[]) => {
  const aggs = extendedMappingFields.map((f) => {
    if (['keyword', 'id'].includes(f.type)) {
      return (
        dotToUnderscore(f.field) + ' {\n     buckets {\n      key\n        doc_count\n    }\n  }'
      );
    } else if (['long', 'float', 'integer', 'date'].includes(f.type)) {
      return dotToUnderscore(f.field) + '{\n    stats {\n  max\n   min\n    }\n    }';
    } else if (['boolean'].includes(f.type)) {
      return (
        dotToUnderscore(f.field) +
        ' {\n      buckets {\n       key\n       doc_count\n     }\n    }'
      );
    } else {
      return '';
    }
  });
  return aggs.join(' ');
};
