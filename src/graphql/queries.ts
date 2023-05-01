import { gql } from '@apollo/client';
import { TExtendedMapping } from '@ferlab/ui/core/components/filters/types';
import { dotToUnderscore, underscoreToDot } from '@ferlab/ui/core/data/arranger/formatting';
import { IExtendedMappingResults } from '@ferlab/ui/core/graphql/types';

export const INDEX_EXTENDED_MAPPING = (index: string) => gql`
query ExtendedMapping_${index} {
  ${index} {
    extended
  }
}
`;

export const AGGREGATION_QUERY = (
  index: string,
  aggList: string[],
  mappingResults: IExtendedMappingResults,
) => {
  if (!mappingResults || mappingResults.loading) return gql``;

  const aggListDotNotation = aggList.map((i) => underscoreToDot(i));

  const extendedMappingsFields = aggListDotNotation.flatMap((i) =>
    (mappingResults?.data || []).filter((e) => e.field === i),
  );

  return gql`
      query AggregationInformation($sqon: JSON) {
        ${index} {
           aggregations (filters: $sqon, include_missing:false){
            ${generateAggregations(extendedMappingsFields)}
          }
        }
      }
    `;
};

const generateAggregations = (extendedMappingFields: TExtendedMapping[]) => {
  const aggs = extendedMappingFields.map((f) => {
    if (['keyword', 'id'].includes(f.type)) {
      return (
        dotToUnderscore(f.field) +
        ' {\n     buckets {\n      key\n        key_as_string\n        doc_count\n    }\n  }'
      );
    } else if (['long', 'float', 'integer', 'date'].includes(f.type)) {
      return dotToUnderscore(f.field) + '{\n    stats {\n  max\n   min\n    }\n    }';
    } else if (['boolean'].includes(f.type)) {
      return (
        dotToUnderscore(f.field) +
        ' {\n      buckets {\n       key\n        key_as_string\n       doc_count\n     }\n    }'
      );
    } else {
      return '';
    }
  });
  return aggs.join(' ');
};
