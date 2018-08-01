import * as React from 'react';
import { css } from 'emotion';
import { get } from 'lodash';
import Query from '@arranger/components/dist/Query';
import DownloadFileButton from 'components/FileRepo/DownloadFileButton';
import { arrangerGqlRecompose } from 'services/arranger';
import { withApi } from 'services/api';
import DownloadIcon from 'icons/DownloadIcon';
import { ControlledIcon, TableSpinner } from './ui';

export default ({ theme, userProjectIds, loadingGen3User }) => [
  {
    index: 13,
    content: {
      accessor: 'kf_id',
      Header: () => <DownloadIcon width={13} fill={theme.greyScale3} />,
      Cell: withApi(({ value, api }) => (
        <Query
          renderError
          api={arrangerGqlRecompose(api, 'TableRowStudyId')}
          projectId={'june_13'}
          shouldFetch={true}
          query={`query ($sqon: JSON) {
            file {
              aggregations(filters: $sqon) {
                participants__study__external_id {
                  buckets {
                    key
                  }
                }
              }
            }
          }`}
          variables={{
            sqon: {
              op: 'and',
              content: [
                {
                  op: 'in',
                  content: {
                    field: 'kf_id',
                    value: [value],
                  },
                },
              ],
            },
          }}
          render={({ loading: loadingQuery, data }) => {
            const studyIdBucket = (get(
              data,
              'file.aggregations.participants__study__external_id.buckets',
            ) || [])[0];
            return (
              <div
                className={css`
                  display: flex;
                  align-items: center;
                  justify-content: center;
                `}
              >
                {studyIdBucket ? (
                  userProjectIds.includes(studyIdBucket.key) ? (
                    <DownloadFileButton kfId={value} />
                  ) : (
                    <ControlledIcon />
                  )
                ) : loadingQuery || loadingGen3User ? (
                  <TableSpinner style={{ width: 20, height: 20 }} />
                ) : (
                  <ControlledIcon />
                )}
              </div>
            );
          }}
        />
      )),
      width: 40,
      sortable: false,
      resizable: false,
    },
  },
];
