import React from 'react';
import get from 'lodash/get';
import difference from 'lodash/difference';
import Query from '@kfarranger/components/dist/Query';
import Proptypes from 'prop-types';

const FamilyDataTypesStatsQuery = ({
  api,
  dataTypes = [],
  participantIds,
  projectId,
  render = () => {},
} = {}) => (
  <Query
    renderError
    shouldFetch={true}
    api={api}
    projectId={projectId}
    name={`dataTypeQuery`}
    query={`
        query dataTypes(${dataTypes.map((dataType, i) => `$sqon${i}: JSON`).join(', ')}) {
          file {
            ${dataTypes
              .map(
                (dataType, i) => `
                ${dataType.key.replace(/[^\da-z]/gi, '')}: aggregations(filters: $sqon${i}) {
                  size {
                    stats {
                      sum
                    }
                  }
                }
                ${dataType.key.replace(/[^\da-z]/gi, '')}family: aggregations(filters: $sqon${i}) {
                  participants__family__family_compositions__family_members__kf_id {
                    buckets {
                      key
                    }
                  }
                }
              `,
              )
              .join('\n')}
          }
        }
      `}
    variables={dataTypes.reduce((acc, dataType, i) => {
      const dataTypeFilters = (ids) => [
        {
          op: 'in',
          content: { field: 'data_type', value: [dataType.key] },
        },
        {
          op: 'in',
          content: { field: 'participants.kf_id', value: ids },
        },
      ];

      return {
        ...acc,
        [`sqon${i}`]: {
          op: 'and',
          content: dataTypeFilters(participantIds),
        },
      };
    }, {})}
    render={({ loading, data }) =>
      render(
        loading
          ? { loading, fileTypeStats: [] }
          : {
              loading,
              fileTypeStats: dataTypes.map((bucket) => {
                const aggs = get(data, `file`);
                const familyMemberBuckets = get(
                  aggs,
                  `${bucket.key.replace(
                    /[^\da-z]/gi,
                    '',
                  )}family.participants__family__family_compositions__family_members__kf_id.buckets`,
                );
                const familyMembersKeys = difference(
                  (familyMemberBuckets && familyMemberBuckets.map(({ key }) => key)) || [],
                  participantIds,
                );
                return {
                  familyMembersKeys,
                  fileType: bucket.key,
                  members: familyMembersKeys.length,
                  files: bucket.doc_count,
                  fileSize: get(aggs, `${bucket.key.replace(/[^\da-z]/gi, '')}.size.stats.sum`),
                };
              }),
            },
      )
    }
  />
);

FamilyDataTypesStatsQuery.propTypes = {
  api: Proptypes.func,
  dataTypes: Proptypes.array,
  participantIds: Proptypes.array,
  projectId: Proptypes.string,
  render: Proptypes.func,
};

export default FamilyDataTypesStatsQuery;
