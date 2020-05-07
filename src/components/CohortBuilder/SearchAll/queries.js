import get from 'lodash/get';
import gql from 'graphql-tag';

const AGGREGATABLE_FIELDS_TYPES = ['boolean', 'date', 'id', 'keyword', 'text'];
// const NONAGGREGATABLE_FIELDS_TYPES = ['float', 'integer', 'long'];
const UNSUPPORTED_FIELDS_TYPES = ['nested', 'object'];

const toGqlFieldPath = fieldPath => fieldPath.replace(/\./g, '__');

const getBuckets = searchFields =>
  searchFields
    .map(toGqlFieldPath)
    .reduce((acc, gqlFieldName) => `${acc} ${gqlFieldName} { buckets { doc_count key } }`, '');

const isTypeAggregatable = type => AGGREGATABLE_FIELDS_TYPES.includes(type);

export const searchAllQueries = (sqon, fields, extendedMapping) => {
  // keep relevant extended mappings
  const filteredMappings = extendedMapping.filter(m => fields.includes(m.field));
  const filteredMappingsMap = new Map(filteredMappings.map(m => [m.field, m]));

  // If a field of an unsupported type is passed, ignore it, but warn.
  const unsupportedFields = filteredMappings.filter(m => UNSUPPORTED_FIELDS_TYPES.includes(m.type));
  if (unsupportedFields.length > 0) {
    console.warn(
      `[SearchAll] found unsupported fields in query, they will be ignored.`,
      unsupportedFields,
    );
  }

  // separate aggreagatable fields
  const aggregatableFieldsMappings = filteredMappings.filter(m => isTypeAggregatable(m.type));
  const aggregatableFields = fields.filter(f =>
    aggregatableFieldsMappings.some(m => m.field === f),
  );

  if (aggregatableFields.length === 0) {
    return [];
  }

  const query = gql`
    query($sqon: JSON) {
      participant {
        aggregations(filters: $sqon) {
          ${getBuckets(aggregatableFields)}
        }
      }
    }`;

  return [
    {
      query,
      variables: { sqon },
      transform: data => {
        if (data.errors) {
          return { errors: data.errors };
        }

        const aggregations = get(data, 'data.participant.aggregations', {});

        // merge aggragatable and nonaggregatable fields together,
        //  respecting the original fields order
        //  and turn them into usable objects for the SearchAll
        return fields.reduce((acc, field) => {
          const isAggregation = aggregatableFields.includes(field);
          const fieldPath = toGqlFieldPath(field);
          const fieldMapping = filteredMappingsMap.get(field);
          acc[fieldPath] = {
            name: field,
            isAggregation,
            displayName: fieldMapping.displayName || '',
            buckets: isAggregation
              ? aggregations[fieldPath].buckets
              : [
                  {
                    doc_count: 0,
                    key: '',
                  },
                ],
          };
          return acc;
        }, {});
      },
    },
  ];
};
