import React from 'react';
import styled from 'react-emotion';
import { withTheme } from 'emotion-theming';
import { compose } from 'recompose';
import { CohortCard } from '../ui';
import gql from 'graphql-tag';
import BaseDataTable from 'uikit/DataTable';
import { get, sortBy } from 'lodash';
import { withApi } from 'services/api';
import { toExpStratQueries } from './FileBreakdownQueries';
import saveSet from '@arranger/components/dist/utils/saveSet';
import { injectState } from 'freactal';
import graphql from 'services/arranger';
import LinkWithLoader from 'uikit/LinkWithLoader';
import { createFileRepoLink } from '../../util';
import QueriesResolver from '../../QueriesResolver';

const EXP_MISSING = '__missing__';

const columnStyles = {
  margin: '-10px 0',
};

const Column = styled('span')`
  font-size: 11px;
`;

const FilesColumn = styled(Column)`
  color: ${({ theme }) => theme.hover};
  text-decoration: underline;
`;

const sumTotalFilesInData = dataset =>
  dataset.reduce((accumulator, datum) => accumulator + parseInt(datum.files, 10), 0);

const generateFileRepositoryUrl = async (dataType, experimentalStrategy, user, api, origSqon) => {
  const sqon = {
    op: 'and',
    content: [
      origSqon,
      {
        op: 'in',
        content: { field: 'files.experiment_strategies', value: [`${experimentalStrategy}`] },
      },
      { op: 'in', content: { field: 'files.data_type', value: [`${dataType}`] } },
    ],
  };

  const participantSet = await saveSet({
    type: 'participant',
    sqon: sqon || {},
    userId: user.egoId,
    path: 'kf_id',
    api: graphql(api),
  });

  const setId = get(participantSet, 'data.saveSet.setId');

  const fileSqon = {
    op: 'and',
    content: [
      {
        op: 'in',
        content: {
          field: 'participants.kf_id',
          value: `set_id:${setId}`,
        },
      },
    ],
  };

  const fileRepoLink = createFileRepoLink(fileSqon);
  return fileRepoLink;
};

const localizeFileQuantity = quantity => `${Number(quantity).toLocaleString()}`;

const generateFileColumnContents = (dataset, state, api, sqon) =>
  dataset.map(datum => ({
    ...datum,
    fileLink: (
      <LinkWithLoader
        getLink={async e =>
          await generateFileRepositoryUrl(
            datum.dataType,
            datum.experimentalStrategy,
            state.loggedInUser,
            api,
            sqon,
          )
        }
      >
        {localizeFileQuantity(datum.files)}
      </LinkWithLoader>
    ),
  }));

export const fileBreakdownQuery = sqon => ({
  query: gql`
    query($sqon: JSON) {
      participant {
        aggregations(filters: $sqon) {
          files__data_type {
            buckets {
              key
            }
          }
        }
      }
    }
  `,
  variables: { sqon },
  transform: data =>
    get(data, 'data.participant.aggregations.files__data_type.buckets', []).map(types => types.key),
});

const FileBreakdown = ({ fileDataTypes, sqon, theme, state, api, isParentLoading }) => (
  <QueriesResolver
    name="GQL_FILE_BREAKDOWN_1"
    api={api}
    queries={toExpStratQueries({ fileDataTypes, sqon })}
  >
    {({ data: fileBreakdownQueries, isLoading: isLoadingFileQueries }) => (
      <QueriesResolver name="GQL_FILE_BREAKDOWN_2" api={api} queries={fileBreakdownQueries.flat()}>
        {({ data, isLoading }) => {
          const sortedData = sortBy(data, ({ dataType }) => dataType.toUpperCase());
          const finalData = isLoading
            ? null
            : generateFileColumnContents(sortedData, state, api, sqon);
          const filesTotal = isLoading
            ? null
            : localizeFileQuantity(sumTotalFilesInData(finalData));

          return (
            <CohortCard
              scrollable={true}
              title="Available Data"
              badge={filesTotal ? filesTotal : null}
              loading={isParentLoading || isLoadingFileQueries || isLoading}
            >
              {!data ? (
                <div>No data</div>
              ) : (
                <BaseDataTable
                  showPagination={false}
                  header={null}
                  columns={[
                    {
                      Header: 'Data Type',
                      accessor: 'dataType',
                      minWidth: 75,
                      style: columnStyles,
                    },
                    {
                      Header: 'Experimental Strategy',
                      accessor: 'experimentalStrategy',
                      style: columnStyles,
                    },
                    {
                      Header: 'Files',
                      accessor: 'fileLink',
                      minWidth: 40,
                      style: columnStyles,
                    },
                  ]}
                  className="-highlight"
                  data={finalData}
                  transforms={{
                    dataType: dataType => <Column>{dataType}</Column>,
                    experimentalStrategy: experimentalStrategy => (
                      <Column>
                        {experimentalStrategy === EXP_MISSING ? '' : experimentalStrategy}
                      </Column>
                    ),
                    fileLink: fileLink => <FilesColumn>{fileLink}</FilesColumn>,
                  }}
                />
              )}
            </CohortCard>
          );
        }}
      </QueriesResolver>
    )}
  </QueriesResolver>
);

export default compose(
  withTheme,
  withApi,
  injectState,
)(FileBreakdown);
