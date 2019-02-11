import React from 'react';
import styled from 'react-emotion';
import PropTypes from 'prop-types';
import { mq } from 'uikit/BreakpointHelper';
import { Visible } from 'react-grid-system';
import Tables from './Tables';

const SummaryTableWrapper = styled('div')`
  height: 100%;
  width: 100%;
  display: flex;
  flex-direction: column;
  border: 1px solid ${({ theme }) => theme.greyScale5};

  > div {
    border: none;
    margin-bottom: 5px;
  }

  ${mq[1]} {
    flex-direction: row;
    border: none;

    > div {
      border: 1px solid ${({ theme }) => theme.greyScale5};
      margin-right: 20px;
      align-self: flex-start;
    }

    > div:last-child {
      margin-right: 0;
    }
  }
`;

const SummaryTable = ({ rows }) => (
  <SummaryTableWrapper>
    <Visible xs sm>
      <Tables rows={rows} amount={1} />
    </Visible>
    <Visible md lg xl>
      <Tables rows={rows} amount={2} />
    </Visible>
  </SummaryTableWrapper>
);

SummaryTable.propTypes = {
  rows: PropTypes.arrayOf(
    PropTypes.shape({
      title: PropTypes.string,
    }),
  ).isRequired,
};

export default SummaryTable;
