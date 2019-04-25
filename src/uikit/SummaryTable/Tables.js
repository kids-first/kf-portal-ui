import React from 'react';
import styled, { css } from 'react-emotion';
import { chunk } from 'lodash';

const Table = styled('div')`
  flex: 1;
  align-sef: flex-start;
  display: grid;
  grid-template-columns: auto 1fr;
`;

const cell = props => css`
  padding: 7px 12px;
  font-size: 13px;
  text-align: left;
  background-color: ${props.index % 2 === 0 ? props.theme.backgroundGrey : '#fff'};
`;

const SummaryTitle = styled('div')`
  ${cell};
  color: ${({ theme }) => theme.secondary};
  font-weight: 600;
  font-family: ${({ theme }) => theme.fonts.default};
  padding-right: 0;
`;

const SummaryContent = styled('div')`
  ${cell};
  color: ${({ theme }) => theme.greyScale1};
  font-family: ${({ theme }) => theme.fonts.details};
  min-width: 100px;
  overflow-wrap: break-word;
  word-wrap: break-word;
  padding-left: 10%;
`;

const Tables = ({ rows, amount }) => {
  const numOfTables = amount === 1 ? rows.length : rows.length / amount;
  const tables = chunk(rows, numOfTables);

  return tables.map((table, i) => (
    <Table key={i}>
      {table.map((row, i) => (
        <React.Fragment key={i}>
          <SummaryTitle index={i}>{row.title}</SummaryTitle>
          <SummaryContent index={i}>{row.summary}</SummaryContent>
        </React.Fragment>
      ))}
    </Table>
  ));
};

export default Tables;
