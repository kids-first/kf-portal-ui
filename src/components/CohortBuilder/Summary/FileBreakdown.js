import React from 'react';
import styled from 'react-emotion';
import { withTheme } from 'emotion-theming';
import { compose } from 'recompose';

import BaseDataTable from 'uikit/DataTable';

import { UserIntegrationsWrapper, IntegrationTable } from '../../UserProfile/UserIntegrations/ui';
import { TableHeader, TableRow } from 'uikit/Table';

const FileBreakdownWrapper = styled(UserIntegrationsWrapper)`
  margin-top: 10px;
  width: 100%;
`;

const FileBreakdownTableHeader = styled(TableHeader)`
  background: '#EDEEF1';
  font-size: 11px;
  min-width: 75px;
`;

const FileBreakdownTableBody = styled('tbody')`
  & tr td {
    font-size: 11px;
    border-top: none;
    border-bottom: none;
    padding: 8px 4px;
    & a {
      color: ${({ theme }) => theme.hover};
      text-decoration: underline;
    }
  }
  & tr:after {
    content: '';
    position: absolute;
    z-index: 1;
    bottom: 0;
    left: 0;
    background-image: linear-gradient(
      to bottom,
      rgba(255, 255, 255, 0),
      rgba(255, 255, 255, 1) 90%
    );
    width: 100%;
    height: 2em;
  }
  & tr:nth-child(odd) td {
    background: '#FFFFFF';
  }
  & tr:nth-child(even) td {
    background: ${({ theme }) => theme.greyScale6};
  }
`;

const FileBreakdownTableFooter = styled(TableRow)`
  td {
    border-right: none;
    border-left: none;
    border-bottom: none;
    text-align: right;
    padding-right: 0;
    padding-top: 10px;
    padding-bottom: 30px;
    font-size: 11px;
    & a {
      color: ${({ theme }) => theme.hover};
      text-decoration: underline;
    }
  }
`;

const FileBreakdownB = ({ data, theme }) => (
  <BaseDataTable
    header={null}
    columns={['Data Type', 'Experimental Strategy', 'Files']}
    data={data}
  />
);

const FileBreakdown = ({ data, theme }) => (
  <FileBreakdownWrapper>
    <IntegrationTable style={{ width: 'inherit' }}>
      <thead>
        <tr>
          <FileBreakdownTableHeader p="5px">Data Type</FileBreakdownTableHeader>
          <FileBreakdownTableHeader p="5px">Experimental Strategy</FileBreakdownTableHeader>
          <FileBreakdownTableHeader p="5px">Files</FileBreakdownTableHeader>
        </tr>
      </thead>
      <FileBreakdownTableBody>
        {data.map(({ dataType, experimentalStrategy, files }) => (
          <tr>
            <td>{dataType}</td>
            <td>{experimentalStrategy}</td>
            <td>
              <a>{files} files</a>
            </td>
          </tr>
        ))}
      </FileBreakdownTableBody>
      <FileBreakdownTableFooter>
        <td colSpan={3}>
          <b>Total:</b> <a>30,037 files</a>
        </td>
      </FileBreakdownTableFooter>
    </IntegrationTable>
  </FileBreakdownWrapper>
);

export default compose(withTheme)(FileBreakdownB);
