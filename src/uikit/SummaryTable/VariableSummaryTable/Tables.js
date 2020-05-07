import React from 'react';
import chunk from 'lodash/chunk';

import './VariableSummaryTable.css';

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

  if (Number.isInteger(approx)) return approx;

  const integer = Math.floor(approx);
  const decimal = '0.' + (approx + '').split('.')[1]; //weird, but best way to get precise decimal places https://stackoverflow.com/questions/4512306/get-decimal-portion-of-a-number-with-javascript
  const nbOfLeftovers = Math.ceil(decimal * integer);

  return integer + Math.ceil(nbOfLeftovers / integer);
}

const Tables = ({ rows, amount }) => {
  //amount is number of tables we want
  let nbOfElePerTable =
    amount === 1 || amount > rows.length ? rows.length : splitter(rows.length, amount);

  const tables = chunk(rows, nbOfElePerTable);

  return tables.map((table, i) => (
    <div className="table-content" key={i}>
      {table.map((row, i) => (
        <React.Fragment key={i}>
          <div className={`cell title ${i % 2 ? '' : 'odd'}`}>{row.title}</div>
          <div className={`cell content ${i % 2 ? '' : 'odd'}`}>{row.summary}</div>
        </React.Fragment>
      ))}
    </div>
  ));
};

export default Tables;
