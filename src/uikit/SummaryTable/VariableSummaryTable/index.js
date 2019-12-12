import React from 'react';
import PropTypes from 'prop-types';
import { mq } from 'uikit/BreakpointHelper';
// [NEXT] TODO - REMOVE react-grid-system in favor of whatever else we have
import { Visible } from 'react-grid-system';
import Tables from './Tables';

import './VariableSummaryTable.css';

const VariableSummaryTable = ({ rows, nbOfTables }) => (
  <div className={`summaryTable-container ${mq[1] ? 'medium' : ''}`}>
    <Visible xs sm>
      <Tables rows={rows} amount={1} />
    </Visible>
    <Visible md lg xl>
      <Tables rows={rows} amount={nbOfTables} />
    </Visible>
  </div>
);

VariableSummaryTable.propTypes = {
  rows: PropTypes.arrayOf(
    PropTypes.shape({
      title: PropTypes.string,
    }),
  ).isRequired,
  nbOfTables: PropTypes.number,
};

export default VariableSummaryTable;
