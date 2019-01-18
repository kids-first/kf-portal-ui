import React from 'react';
import styled, { css } from 'react-emotion';
import PropTypes from 'prop-types';
import _ from 'lodash';
import Row from 'uikit/Row';
import { mq } from 'uikit/BreakpointHelper';
import Column from '../Column';

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

const Table = styled(Column)`
  flex: 1;
`;

const SummaryRow = styled(Row)`
  background-color: ${({ index, theme }) => (index % 2 === 0 ? theme.backgroundGrey : '#fff')};
`;

const cell = props => css`
  padding: 7px 12px;
  font-size: 13px;
  text-align: left;
  flex: 0 1 50%;
  min-width: 50%;
`;

const SummaryTitle = styled('div')`
  ${cell};
  color: ${({ theme }) => theme.secondary};
  font-weight: 600;
  font-family: ${({ theme }) => theme.fonts.default};
  padding-right: 0;
  min-width: 200px;
`;

const SummaryContent = styled('div')`
  ${cell};
  color: ${({ theme }) => theme.greyScale1};
  font-family: ${({ theme }) => theme.fonts.details};
  min-width: 0;
  overflow-wrap: break-word;
  word-wrap: break-word;
`;

const SummaryTable = ({ rows, maxRows = 6 }) => {
  // break into seperate tables based on maxRows
  const tables = _.chunk(rows, maxRows);

  return (
    <SummaryTableWrapper>
      {tables.map(table => (
        <Table>
          {table.map((row, i) => (
            <SummaryRow index={i} key={i}>
              <SummaryTitle>{row.title}</SummaryTitle>
              <SummaryContent>{row.summary}</SummaryContent>
            </SummaryRow>
          ))}
        </Table>
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
