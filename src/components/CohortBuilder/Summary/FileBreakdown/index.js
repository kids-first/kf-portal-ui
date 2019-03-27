import React from 'react';
import styled from 'react-emotion';
import { withTheme } from 'emotion-theming';
import { compose } from 'recompose';
import _, { get, sortBy, sumBy, differenceBy } from 'lodash';

import { CohortCard } from '../ui';
import BaseDataTable from 'uikit/DataTable';
import { withApi } from 'services/api';
import saveSet from '@arranger/components/dist/utils/saveSet';
import { injectState } from 'freactal';
import graphql from 'services/arranger';
import LinkWithLoader from 'uikit/LinkWithLoader';
import { createFileRepoLink } from '../../util';
import { toFileBreakdownQueries, toFileIdsByDataTypeQuery } from './queries';
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

const DataProvider = withApi(({ api, children, dataTypesExpStratPairs, sqon }) => (
  <QueriesResolver
    name="GQL_FILE_BREAKDOWN_1"
    api={api}
    queries={_(dataTypesExpStratPairs)
      .uniqBy('dataType')
      .map('dataType')
      .map(toFileIdsByDataTypeQuery(sqon))
      .value()}
  >
    {({ data: dataTypeFileIdBuckets, isLoading: isQuery1Loading }) => (
      <QueriesResolver
        name="GQL_FILE_BREAKDOWN_2"
        api={api}
        queries={dataTypesExpStratPairs.map(toFileBreakdownQueries(sqon))}
      >
        {({ data: dataWithExperimentalStrategyFilter, isLoading }) => {
          const dataWithoutExperimentalStrategy = dataTypeFileIdBuckets.map(
            ({ dataType, fileIdBuckets }) => {
              const fileIdsWithExperimentalStrategy = _(dataWithExperimentalStrategyFilter)
                .filter(({ dataType: _dt }) => _dt === dataType)
                .map(({ files }) => files)
                .flatten()
                .value();
              const filesWithoutExperimentalStrategy = differenceBy(
                fileIdBuckets,
                fileIdsWithExperimentalStrategy,
                'key',
              );
              return {
                dataType,
                experimentalStrategy: '--',
                files: filesWithoutExperimentalStrategy,
                filesCount: filesWithoutExperimentalStrategy.length,
              };
            },
          );
          return children({
            data: dataWithExperimentalStrategyFilter
              .concat(dataWithoutExperimentalStrategy)
              .filter(({ filesCount }) => !!filesCount),
            isLoading: isLoading || isQuery1Loading,
          });
        }}
      </QueriesResolver>
    )}
  </QueriesResolver>
));

const FileBreakdown = ({
  dataTypesExpStratPairs,
  sqon,
  state: { loggedInUser },
  api,
  isLoading: isParentLoading,
}) => (
  <DataProvider dataTypesExpStratPairs={dataTypesExpStratPairs} sqon={sqon}>
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
  </DataProvider>
);

export { dataTypesExpStratPairsQuery } from './queries';

export default compose(
  withTheme,
  withApi,
  injectState,
)(FileBreakdown);
