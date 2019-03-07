import React from 'react';
import styled from 'react-emotion';
import { withTheme } from 'emotion-theming';
import { compose } from 'recompose';
import { CohortCard } from '../ui';
import { Link } from 'uikit/Core';
import gql from 'graphql-tag';
import LoadingSpinner from 'uikit/LoadingSpinner';
import BaseDataTable from 'uikit/DataTable';
import { get } from 'lodash';
import { withApi } from '../../../../services/api';
import QueryResolver from './QueryResolver';
import saveSet from '@arranger/components/dist/utils/saveSet';
import { injectState } from 'freactal';
import graphql from 'services/arranger';

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

const SEARCH_FILE_RELATIVE_URL = '/search/file';

const generateFileRepositoryUrl = async (dataType, experimentalStrategy, user, api) => {
  console.log('generate!!!', user, sqon);

  const sqon = {
    op: 'and',
    content: [
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

  const setId = get(participantSet, 'participantSet.data.saveSet.setId');

  console.log('generate file repo url', participantSet, setId);
  const fileRepoLink =
    `${SEARCH_FILE_RELATIVE_URL}?sqon=` +
    encodeURI(
      JSON.stringify({
        op: 'and',
        content: [
          {
            op: 'in',
            content: {
              field: 'kf_id',
              value: `set_id:${setId}`,
            },
          },
        ],
      }),
    );
  console.log('file rpeo link', fileRepoLink);
  return fileRepoLink;
};

const localizeFileQuantity = quantity =>
  `${Number(quantity).toLocaleString()} file${quantity > 1 ? 's' : ''}`;

const generateFileColumnContents = (dataset, state, api) =>
  dataset.map(datum => ({
    ...datum,
    fileLink: (
      <a
        href=""
        onClick={() =>
          generateFileRepositoryUrl(datum.dataType, datum.expStrat, state.loggedInUser, api)
        }
      >
        {localizeFileQuantity(datum.files)}
      </a>
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

const FileBreakdown = ({ fileDataTypes, sqon, theme, state, api }) => (
  <QueryResolver sqon={sqon} data={fileDataTypes}>
    {({ data, isLoading }) => {
      const finalData = isLoading ? null : generateFileColumnContents(data);
      const filesTotal = isLoading ? null : localizeFileQuantity(sumTotalFilesInData(finalData));

      return isLoading ? (
        <LoadingSpinner color={theme.greyScale11} size={'50px'} />
      ) : !data ? (
        <div>No data</div>
      ) : (
        <CohortCard scrollable={true} title="Available Data" badge={filesTotal ? filesTotal : null}>
          <BaseDataTable
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
              experimentalStrategy: experimentalStrategy => <Column>{experimentalStrategy}</Column>,
              fileLink: fileLink => <FilesColumn>{fileLink}</FilesColumn>,
            }}
          />
        </CohortCard>
      );
    }}
  </QueryResolver>
);

export default compose(
  withTheme,
  withApi,
  injectState,
)(FileBreakdown);
