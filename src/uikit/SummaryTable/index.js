import React from 'react';
import styled from 'react-emotion';
import PropTypes from 'prop-types';

const Table = styled('table')`
  border: 1px solid ${({ theme }) => theme.greyScale5};
  width: 100%;
`;

const TableRow = styled('tr')`
  background-color: ${({ index, theme }) => (index % 2 === 0 ? theme.backgroundGrey : '#fff')};
`;

const TableCell = styled('td')`
  padding: 12px 7px;
`;

const TableTitle = styled(TableCell)`
  vertical-align: top;
  color: ${({ theme }) => theme.secondary};
  size: 13px;
  font-weight: 600;
  font-family: ${({ theme }) => theme.fonts.default};
  text-align: left;
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
