import React from 'react';
import styled, { css } from 'react-emotion';
import PropTypes from 'prop-types';
import Row from 'uikit/Row';
import { mq } from 'uikit/BreakpointHelper';
import Column from '../Column';

const SummaryTableWrapper = styled('div')`
flex-direction: column;
border: 1px solid ${({ theme }) => theme.greyScale5};
> div {
  border: none;
}
}
  ${mq[1]} {
  display: flex;
  flex-direction: row;
  border:none;

  > div {
    border: 1px solid ${({ theme }) => theme.greyScale5};
    margin-right: 20px;
  }

  > div:last-child {
    margin-right: 0;
  }
`;

const Summary = styled(Column)``;

const SummaryRow = styled(Row)`
  background-color: ${({ index, theme }) => (index % 2 === 0 ? theme.backgroundGrey : '#fff')};
`;

const cell = props => css`
  padding: 7px 12px;
  font-size: 13px;
  text-align: left;
`;

const SummaryTitle = styled('div')`
  ${cell};
  color: ${({ theme }) => theme.secondary};
  font-weight: 600;
  font-family: ${({ theme }) => theme.fonts.default};
  min-width: 180px;
  padding-right: 0;
`;

const SummaryContent = styled('div')`
  ${cell};
  color: ${({ theme }) => theme.greyScale1};
  font-family: ${({ theme }) => theme.fonts.details};
  margin-right: 40px;
`;

const SummaryTable = ({ rows, maxRows }) => {
  return (
    <SummaryTableWrapper>
      <Summary>
        {rows.map((row, i) => (
          <SummaryRow index={i} key={i}>
            <SummaryTitle>{row.title}</SummaryTitle>
            <SummaryContent>{row.summary}</SummaryContent>
          </SummaryRow>
        ))}
      </Summary>
      <Summary>
        {rows.map((row, i) => (
          <SummaryRow index={i} key={i}>
            <SummaryTitle>{row.title}</SummaryTitle>
            <SummaryContent>{row.summary}</SummaryContent>
          </SummaryRow>
        ))}
      </Summary>
    </SummaryTableWrapper>
  );
};

SummaryTable.propTypes = {
  rows: PropTypes.arrayOf(
    PropTypes.shape({
      title: PropTypes.string,
    }),
  ).isRequired,
};

export default SummaryTable;
