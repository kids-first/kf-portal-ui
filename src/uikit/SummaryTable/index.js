import React from 'react';
import VariableSummaryTable from './VariableSummaryTable';

const SummaryTable = ({ rows }) => (
  <VariableSummaryTable rows={rows} nbOfTables={2} /> //backwards compatibility for File page
);

export default SummaryTable;
