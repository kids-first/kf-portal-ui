import React from 'react';
import styled from 'react-emotion';
import SearchIcon from 'react-icons/lib/fa/search';
import FaTimesCircleO from 'react-icons/lib/fa/times-circle';
import Column from 'uikit/Column';
import { TealActionButton, WhiteButton } from 'uikit/Button';
import PropTypes from 'prop-types';

import './SearchAll.css';

const SearchAllContainer = styled('div')`
  display: flex;
  flex: 1;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100%;
  z-index: 1;

  .query-container {
    height: 100%;
    padding-top: 17px;
    padding-left: 12px;
    padding-right: 14px;
  }

  .results-container: {
    position: absolute;
    top: 100%;
  }
`;

const QueryContainer = styled(Column)`
  display: flex;
  flex-shrink: 0;
  border-top: 4px solid ${({ borderColor }) => borderColor};
  border-right: 1px solid ${({ theme }) => theme.greyScale8};
  padding: 7px;

  .query-content {
    border-radius: 10px;
    border: solid 2px ${({ theme }) => theme.greyScale8};

    &:hover {
      box-shadow: 0 0 10px skyblue;
    }
  }

  .input-icon {
    color: ${({ theme }) => theme.greyScale11};
  }
`;

const ResultsContainer = styled('div')`
  position: absolute;
  display: none;

  top: 100%;
  width: 100%;

  border: 1px solid ${({ theme }) => theme.greyScale5};
  border-radius: 5px;
  box-shadow: ${({ theme }) => theme.card['box-shadow']};
  background-color: white;
  padding: 0;

  &.open {
    display: block;
  }

  .results-content {
    padding: 0;

    .results-header {
      font-family: ${({ theme }) => theme.fonts.details};
      font-style: italic;
      font-size: 12px;
      color: ${({ theme }) => theme.card.color};
      width: 100%;
      border-bottom: 1px solid ${({ theme }) => theme.greyScale5};
    }

    .results-body {
    }

    .results-footer {
      background-color: ${({ theme }) => theme.greyScale5};
      border-top: 1px solid ${({ theme }) => theme.greyScale5};
    }
  }
`;

// TODO JB
// - fix styles
// - ref: rename title => placeholder
// - ref: extract query to component
// - ref: extract result to component
// -

class SearchAll extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      value: '',
      isOpen: false,
      resultsCount: 0,
    };
    this.handleQueryChange = this.handleQueryChange.bind(this);
    this.handleClearQuery = this.handleClearQuery.bind(this);
  }

  setValue(value) {
    this.setState({
      value,
      isOpen: value !== '',
    });
  }

  handleQueryChange(evt) {
    this.setValue(evt.currentTarget.value);
  }

  handleClearQuery() {
    this.setValue('');
  }

  render() {
    const { color, title } = this.props;
    const { value, isOpen, resultsCount } = this.state;

    return (
      <SearchAllContainer className="search-all-filter">
        <QueryContainer borderColor={color} className="query-container">
          <div className="query-content">
            <span className={'input-icon icon-left'}>
              <SearchIcon />
            </span>
            <input
              type="text"
              value={value}
              onChange={this.handleQueryChange}
              aria-label={title}
              placeholder={title}
            />
            {value && (
              <span className={'input-icon icon-right'}>
                <FaTimesCircleO onClick={this.handleClearQuery} />
              </span>
            )}
          </div>
        </QueryContainer>
        <ResultsContainer className={`results-container${isOpen ? ' open' : ''}`}>
          <div className="results-content">
            <div className="results-section results-header">{`${resultsCount.toLocaleString()} results found`}</div>
            <div className="results-section results-body" />
            <div className="results-section results-footer">
              <WhiteButton onClick={this.handleClearQuery}>Cancel</WhiteButton>
              <TealActionButton disabled={false} onClick={() => {}}>
                Apply
              </TealActionButton>
            </div>
          </div>
        </ResultsContainer>
      </SearchAllContainer>
    );
  }
}

SearchAll.defaultProps = {
  color: 'white',
  title: 'search',
};

SearchAll.propTypes = {
  color: PropTypes.string,
  title: PropTypes.string,
};

export default SearchAll;
