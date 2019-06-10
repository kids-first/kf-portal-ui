import React from 'react';
import styled from 'react-emotion';
import PropTypes from 'prop-types';
import { mq } from 'uikit/BreakpointHelper';
import { Visible } from 'react-grid-system';
import VariableSummaryTable from './VariableSummaryTable';

const SummaryTable = ({ rows }) => (
  <VariableSummaryTable rows={rows} nbOfTables={2} /> //backwards compatibility for File page
);

export default SummaryTable;
