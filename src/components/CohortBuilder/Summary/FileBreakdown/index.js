import React from 'react';
import styled from 'react-emotion';
import { withTheme } from 'emotion-theming';
import { compose } from 'recompose';
import { CohortCard } from '../ui';
import BaseDataTable from 'uikit/DataTable';
import { get, sortBy, sumBy } from 'lodash';
import { withApi } from 'services/api';
import saveSet from '@arranger/components/dist/utils/saveSet';
import { injectState } from 'freactal';
import graphql from 'services/arranger';
import LinkWithLoader from 'uikit/LinkWithLoader';
import { createFileRepoLink } from '../../util';
import { toFileBreakdownQueries } from './queries';
import QueriesResolver from '../../QueriesResolver';

const EXP_MISSING = '__missing__';

const columnStyles = {
  padding: '5px 10px',
};

const Column = styled('span')`
  font-size: 11px;
`;

const FilesColumn = styled(Column)`
  color: ${({ theme }) => theme.hover};
  text-decoration: underline;
`;

const generateFileRepositoryUrl = async ({ fileBuckets, user, api }) => {
  const fileIds = fileBuckets.map(({ key }) => key);
  const fileSet = await saveSet({
    type: 'file',
    sqon: { op: 'and', content: [{ op: 'in', content: { field: 'kf_id', value: fileIds } }] },
    userId: user.egoId,
    path: 'kf_id',
    api: graphql(api),
  });

  const setId = get(fileSet, 'data.saveSet.setId');

  const fileRepoLink = createFileRepoLink({
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
  });
  return fileRepoLink;
};

const localizeFileQuantity = quantity => `${Number(quantity).toLocaleString()}`;

const generateFileColumnContents = (dataset, loggedInUser, api) =>
  dataset.map(entry => ({
    ...entry,
    fileLink: (
      <LinkWithLoader
        getLink={async e =>
          await generateFileRepositoryUrl({ fileBuckets: entry.files, user: loggedInUser, api })
        }
      >
        {localizeFileQuantity(entry.filesCount)}
      </LinkWithLoader>
    ),
  }));

const FileBreakdown = ({
  dataTypesExpStratPairs,
  sqon,
  state: { loggedInUser },
  api,
  isLoading: isParentLoading,
}) => (
  <QueriesResolver
    name="GQL_FILE_BREAKDOWN_1"
    api={api}
    queries={dataTypesExpStratPairs.map(toFileBreakdownQueries(sqon))}
  >
    {({ data, isLoading }) => {
      const sortedData = sortBy(data, ({ dataType }) => dataType.toUpperCase());
      const tableEntries = isLoading
        ? null
        : generateFileColumnContents(sortedData, loggedInUser, api);
      const filesTotal = localizeFileQuantity(sumBy(tableEntries, ({ filesCount }) => filesCount));

      return (
        <CohortCard
          scrollable={true}
          title="Available Data Files"
          badge={isLoading ? null : filesTotal}
          loading={isParentLoading || isLoading}
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
                { Header: 'Files', accessor: 'fileLink', minWidth: 40, style: columnStyles },
              ]}
              className="-highlight"
              data={tableEntries}
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
);

export { dataTypesExpStratPairsQuery } from './queries';

export default compose(
  withTheme,
  withApi,
  injectState,
)(FileBreakdown);
