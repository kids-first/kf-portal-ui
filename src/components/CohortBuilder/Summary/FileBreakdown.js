import React from 'react';
import styled from 'react-emotion';
import { withTheme } from 'emotion-theming';
import { compose } from 'recompose';

import BaseDataTable from 'uikit/DataTable';

const FileBreakdownWrapper = styled('div')`
  margin-top: 10px;
  width: 100%;
`;

const TableFooter = styled('div')`
  text-align: right;
  padding-top: 13px;
  font-size: 11px;
  font-weight: bold;
  color: ${({ theme }) => theme.secondary};
  & a {
    font-weight: normal;
    color: ${({ theme }) => theme.hover};
    text-decoration: underline;
    margin-left: 5px;
  }
`;

const Column = styled('span')`
  font-size: 11px;
`;

const FilesColumn = styled(Column)`
  color: ${({ theme }) => theme.hover};
  text-decoration: underline;
`;

const sumTotalFilesInData = dataset => {
  return dataset.reduce((accumulator, datum) => {
    return accumulator + parseInt(datum.files);
  }, 0);
};

const SEARCH_FILE_RELATIVE_URL = '/search/file';

const generateFileRepositoryUrl = (dataType, experimentalStrategy) => {
  return (
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
    )
  );
};

const localizeFileQuantity = quantity => {
  return `${Number(quantity).toLocaleString()} file${quantity > 1 ? 's' : ''}`;
};

const generateFileColumnContents = dataset => {
  return dataset.map(datum => {
    datum.fileLink = (
      <a href={generateFileRepositoryUrl(datum.dataType, datum.experimentalStrategy)}>
        {localizeFileQuantity(datum.files)}
      </a>
    );
    return datum;
  });
};

const FileBreakdown = ({ data }) => {
  const finalData = generateFileColumnContents(data);
  return (
    <FileBreakdownWrapper>
      <BaseDataTable
        header={null}
        columns={[
          { Header: 'Data Type', accessor: 'dataType' },
          { Header: 'Experimental Strategy', accessor: 'experimentalStrategy' },
          { Header: 'Files', accessor: 'fileLink' },
        ]}
        data={finalData}
        transforms={{
          dataType: dataType => <Column>{dataType}</Column>,
          experimentalStrategy: experimentalStrategy => <Column>{experimentalStrategy}</Column>,
          fileLink: fileLink => <FilesColumn>{fileLink}</FilesColumn>,
        }}
      />
      <TableFooter>
        Total:
        <a href={SEARCH_FILE_RELATIVE_URL}>
          {localizeFileQuantity(sumTotalFilesInData(finalData))}
        </a>
      </TableFooter>
    </FileBreakdownWrapper>
  );
};

export default compose(withTheme)(FileBreakdown);
