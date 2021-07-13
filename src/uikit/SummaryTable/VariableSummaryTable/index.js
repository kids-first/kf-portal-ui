import React from 'react';
import { Grid } from 'antd';
import PropTypes from 'prop-types';

import Tables from './Tables';

import './VariableSummaryTable.css';

const { useBreakpoint } = Grid;

const VariableSummaryTable = ({ rows }) => {
  const screens = useBreakpoint();
  const screenIsSmall = screens.xs;
  return (
    <div className={`summaryTable-container medium`}>
      <Tables rows={rows} amount={screenIsSmall ? 1 : 2} />
    </div>
  );
};

VariableSummaryTable.propTypes = {
  rows: PropTypes.arrayOf(
    PropTypes.shape({
      title: PropTypes.string,
    }),
  ).isRequired,
};

export default VariableSummaryTable;
