import React from 'react';
import styled from 'react-emotion';
import { withTheme } from 'emotion-theming';
import { compose } from 'recompose';
import { CohortCard } from './ui';
import BaseDataTable from 'uikit/DataTable';
import { Link } from 'uikit/Core';

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

const generateFileRepositoryUrl = (dataType, experimentalStrategy) =>
  `${SEARCH_FILE_RELATIVE_URL}?sqon=` +
  encodeURI(
    JSON.stringify({
      op: 'and',
      content: [
        {
          op: 'in',
          content: {
            field: 'data_type',
            value: [dataType],
          },
        },
        {
          op: 'in',
          content: {
            field: 'sequencing_experiments.experiment_strategy',
            value: [experimentalStrategy],
          },
        },
      ],
    }),
  );

const localizeFileQuantity = quantity =>
  `${Number(quantity).toLocaleString()} file${quantity > 1 ? 's' : ''}`;

const generateFileColumnContents = dataset =>
  dataset.map(datum => ({
    ...datum,
    fileLink: (
      <a href={generateFileRepositoryUrl(datum.dataType, datum.experimentalStrategy)}>
        {localizeFileQuantity(datum.files)}
      </a>
    ),
  }));

const FileBreakdown = ({ data }) => {
  const finalData = generateFileColumnContents(data);
  const filesTotal = localizeFileQuantity(sumTotalFilesInData(finalData));

  return (
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
};

export default compose(withTheme)(FileBreakdown);
