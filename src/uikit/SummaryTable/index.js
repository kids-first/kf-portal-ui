import React from 'react';
import styled, { css } from 'react-emotion';
import PropTypes from 'prop-types';
import Row from 'uikit/Row';

const SummaryTableWrapper = styled('div')``;
const SummaryRow = styled(Row)`
  background-color: ${({ index, theme }) => (index % 2 === 0 ? theme.backgroundGrey : '#fff')}
  justify-content: space-between;
`;

const cell = props => css`
  padding: 7px 12px;
  font-size: 13px;
  text-align: left;
`;

const SummaryContent = styled('div')`
  ${cell};
  color: ${({ theme }) => theme.greyScale1};
  font-family: ${({ theme }) => theme.fonts.details};
  margin-right: 40px;
`;

const SummaryTitle = styled('div')`
  ${cell};
  color: ${({ theme }) => theme.secondary};
  font-weight: 600;
  font-family: ${({ theme }) => theme.fonts.default};
  padding-right: 47px;
  max-width: 150px;
`;

const SummaryTable = ({ rows }) => {
  return (
    <SummaryTableWrapper>
      {rows.map((row, i) => (
        <SummaryRow index={i} key={i}>
          <SummaryTitle>{row.title}</SummaryTitle>
          <SummaryContent>{row.summary}</SummaryContent>
        </SummaryRow>
      ))}
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
