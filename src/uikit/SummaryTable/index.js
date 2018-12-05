import React from 'react';
import styled, { css } from 'react-emotion';
import PropTypes from 'prop-types';

const Table = styled('table')`
  border: 1px solid ${({ theme }) => theme.greyScale5};
  width: 100%;
`;

const TableRow = styled('tr')`
  background-color: ${({ index, theme }) => (index % 2 === 0 ? theme.backgroundGrey : '#fff')};
`;

const cellBase = props => css`
  padding: 12px 7px;
  size: 13px;
  text-align: left;
  vertical-align: top;
`;

const TableCell = styled('td')`
  ${cellBase};
  color: ${({ theme }) => theme.greyScale1};
  font-family: ${({ theme }) => theme.fonts.details};
  width: 99%;
`;

const TableTitle = styled('td')`
  ${cellBase};
  white-space: nowrap;
  color: ${({ theme }) => theme.secondary};
  font-weight: 600;
  font-family: ${({ theme }) => theme.fonts.default};
  padding-right: 47px;
`;

const SummaryTable = ({ rows }) => (
  <Table>
    {rows.map((row, i) => (
      <TableRow index={i} key={i}>
        <TableTitle>{row.title}</TableTitle>
        <TableCell>{row.summary}</TableCell>
      </TableRow>
    ))}
  </Table>
);

SummaryTable.propTypes = {};

export default SummaryTable;
