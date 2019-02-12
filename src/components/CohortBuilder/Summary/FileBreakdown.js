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
  padding-right: 0;
  padding-top: 10px;
  padding-bottom: 30px;
  font-size: 11px;
  color: ${({ theme }) => theme.secondary};
  & a {
    color: ${({ theme }) => theme.hover};
    text-decoration: underline;
  }
`;

const FilesColumn = styled('span')`
  color: ${({ theme }) => theme.hover};
  text-decoration: underline;
`;

const sumTotalFilesInData = dataset => {
  return dataset.reduce(function(accumulator, datum) {
    return accumulator + parseInt(datum.files);
  }, 0);
};

const FileBreakdownB = ({ data }) => (
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
        files: studyShortName => (
          <FilesColumn>{Number(studyShortName).toLocaleString()} files</FilesColumn>
        ),
      }}
    />
    <TableFooter>
      <b>Total:</b> <a>{Number(sumTotalFilesInData(data)).toLocaleString()} files</a>
    </TableFooter>
  </FileBreakdownWrapper>
);

export default compose(withTheme)(FileBreakdownB);
