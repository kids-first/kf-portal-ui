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
  return dataset.reduce(function(accumulator, datum) {
    return accumulator + parseInt(datum.files);
  }, 0);
};

const FileBreakdown = ({ data }) => (
  <FileBreakdownWrapper>
    <BaseDataTable
      header={null}
      columns={[
        { Header: 'Data Type', accessor: 'dataType' },
        { Header: 'Experimental Strategy', accessor: 'experimentalStrategy' },
        { Header: 'Files', accessor: 'files' },
      ]}
      data={data}
      transforms={{
        dataType: dataType => <Column>{dataType}</Column>,
        experimentalStrategy: experimentalStrategy => <Column>{experimentalStrategy}</Column>,
        files: fileCount => (
          <FilesColumn>
            {' '}
            <a href="/search/file">{Number(fileCount).toLocaleString()} files</a>
          </FilesColumn>
        ),
      }}
    />
    <TableFooter>
      Total:
      <a href="/search/file">{Number(sumTotalFilesInData(data)).toLocaleString()} files</a>
    </TableFooter>
  </FileBreakdownWrapper>
);

export default compose(withTheme)(FileBreakdown);
