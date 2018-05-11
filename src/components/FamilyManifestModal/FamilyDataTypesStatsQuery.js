import React from 'react';

import { get, difference } from 'lodash';
import Query from '@arranger/components/dist/Query';
import { withApi } from 'services/api';
import { compose } from 'recompose';

export default compose(withApi)(
  ({ api, dataTypes = [], participantIds, projectId, isDisabled, children } = {}) => (
    <Query
      renderError
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
        const dataTypeFilters = ids => [
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
      render={({ data, loading }) => {
        return children(
          loading
            ? { loading }
            : {
                loading,
                data: dataTypes.map(bucket => {
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
        );
      }}
    />
  ),
);
