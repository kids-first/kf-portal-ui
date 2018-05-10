import React from 'react';

import { get, difference } from 'lodash';
import Query from '@arranger/components/dist/Query';
import Spinner from 'react-spinkit';
import { withApi } from 'services/api';
import { compose } from 'recompose';

const spinner = (
  <Spinner
    fadeIn="none"
    name="circle"
    color="#a9adc0"
    style={{
      width: 30,
      height: 30,
      margin: 'auto',
      marginBottom: 20,
    }}
  />
);

export default compose(withApi)(
  ({ api, dataTypes = [], participantIds, projectId, isDisabled, values, children } = {}) => (
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
        return loading
          ? spinner
          : dataTypes.map(bucket => {
              const aggs = get(data, `file`);
              const familyMemberBuckets = get(
                aggs,
                `${bucket.key.replace(
                  /[^\da-z]/gi,
                  '',
                )}family.participants__family__family_compositions__family_members__kf_id.buckets`,
              );
              const familyMembersCount = difference(
                (familyMemberBuckets && familyMemberBuckets.map(({ key }) => key)) || [],
                participantIds,
              ).length;
              return children({
                key: bucket.key,
                fileType: bucket.key,
                members: familyMembersCount,
                files: bucket.doc_count,
                fileSize: get(aggs, `${bucket.key.replace(/[^\da-z]/gi, '')}.size.stats.sum`),
              });
            });
      }}
    />
  ),
);
