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

/**
 * Splits a number into smaller chunks that will be even-ish. Returns the largest chunk, allowing lodash.chunk to do the
 * heavy lifting from then on.
 *
 * Example: 11/3: 4/4/3 -> 4. 12/3: 4/4/4 -> 4.
 *
 * @param number The number to split
 * @param amount The divider (the number of chunks we want)
 * @returns {number} The biggest chunk.
 */
function splitter(number, amount) {
  const approx = number / amount;

  if(Number.isInteger(approx)) return approx;

  const integer = Math.floor(approx);
  const decimal = "0."+(approx+'').split('.')[1]; //weird, but best way to get precise decimal places https://stackoverflow.com/questions/4512306/get-decimal-portion-of-a-number-with-javascript
  const nbOfLeftovers = Math.ceil(decimal*integer);

  return integer + Math.ceil(nbOfLeftovers/integer);
}

const Tables = ({ rows, amount }) => {  //amount is number of tables we want
  let nbOfElePerTable = (amount === 1 || amount > rows.length) ? rows.length : splitter(rows.length, amount);

  const tables = chunk(rows, nbOfElePerTable);

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
