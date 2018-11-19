import React from 'react';
import { compose } from 'recompose';

import { withTheme } from 'emotion-theming';
import { get } from 'lodash';
import Query from '@arranger/components/dist/Query';

import LoadingSpinner from 'uikit/LoadingSpinner';
import { toGqlString } from 'services/utils';
import { withHistory } from 'services/history';
import { withApi } from 'services/api';
import { arrangerGqlRecompose } from 'services/arranger';
import { arrangerProjectId } from 'common/injectGlobals';
import Study from './Study';

const sqonForStudy = studyId => ({
  op: 'and',
  content: [
    {
      op: 'in',
      content: {
        field: 'participants.study.external_id',
        value: [studyId],
      },
    },
  ],
});

const Gen3ProjectList = compose(
  withApi,
  withTheme,
  withHistory,
)(({ projectIds, api, theme, history }) => {
  const query = `
query (${projectIds.map(id => `$${toGqlString(id)}_sqon: JSON`).join(', ')}){
  file {${projectIds
    .map(
      id => `${toGqlString(id)}: aggregations(filters: ${`$${toGqlString(id)}_sqon`}) {
        participants__study__short_name {
          buckets {
            key
          }
        }
      }
    `,
    )
    .join('')}
  }
}`;

  return (
    <Query
      renderError
      api={arrangerGqlRecompose(api)}
      projectId={arrangerProjectId}
      name={`gen3ItemQuery`}
      shouldFetch={true}
      query={query}
      variables={projectIds.reduce(
        (acc, id) => ({
          ...acc,
          [`${toGqlString(id)}_sqon`]: sqonForStudy(id),
        }),
        {},
      )}
      render={({ loading, data }) => {
        const aggregations = get(data, 'file');
        console.log('data', data);
        return aggregations ? (
          projectIds
            .filter(id =>
              get(
                aggregations,
                `${toGqlString(id)}.participants__study__short_name.buckets.length`,
              ),
            )
            .map((id, i) => {
              const studyNameBuckets = get(
                aggregations,
                `${toGqlString(id)}.participants__study__short_name.buckets`,
              );
              const studyName = studyNameBuckets[0];
              //const sqon = sqonForStudy(id);
              return (
                <Study
                  key={i}
                  name={studyName ? studyName.key : ''}
                  codes={''}
                  authorized={400}
                  total={600}
                />
              );
            })
        ) : (
          <LoadingSpinner />
        );
      }}
    />
  );
});

export default Gen3ProjectList;
