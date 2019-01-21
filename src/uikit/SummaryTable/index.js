import React from 'react';
import styled, { css } from 'react-emotion';
import PropTypes from 'prop-types';
import _ from 'lodash';
import { mq } from 'uikit/BreakpointHelper';
import { Visible } from 'react-grid-system';

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

class SummaryTable extends React.Component {
  renderTables = amount => {
    const { rows } = this.props;
    const numOfTables = amount === 1 ? rows.length : rows.length / amount;
    const tables = _.chunk(rows, numOfTables);

    return tables.map(table => (
      <Table>
        {table.map((row, i) => (
          <React.Fragment>
            <SummaryTitle index={i}>{row.title}</SummaryTitle>
            <SummaryContent index={i}>{row.summary}</SummaryContent>
          </React.Fragment>
        ))}
      </Table>
    ));
  };

  render() {
    return (
      <SummaryTableWrapper>
        <Visible xs sm>
          {this.renderTables(1)}
        </Visible>
        <Visible md lg xl>
          {this.renderTables(2)}
        </Visible>
      </SummaryTableWrapper>
    );
  }
}

SummaryTable.propTypes = {
  rows: PropTypes.arrayOf(
    PropTypes.shape({
      title: PropTypes.string,
    }),
  ).isRequired,
};

export default SummaryTable;
