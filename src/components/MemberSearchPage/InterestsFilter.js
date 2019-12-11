import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import fetchListOfMembersAction from 'components/MemberSearchPage/fetchListOfMembers';
import { requestInterestsFilterUpdate } from 'components/MemberSearchPage/actions';
import FilterTable from 'components/MemberSearchPage/FilterTable';
import FilterTableList from 'components/MemberSearchPage/FilterTableList';
import { getCurrentEnd, getCurrentStart, getSelectedFilter } from './utils';
import PropTypes from 'prop-types';

class InterestsFilter extends Component {
  state = {
    showAll: false,
    filterSearchString: '',
  };

  static propTypes = {
    pending: PropTypes.bool,
    error: PropTypes.object,
    count: PropTypes.object.isRequired,
    queryString: PropTypes.string.isRequired,
    currentPage: PropTypes.number.isRequired,
    membersPerPage: PropTypes.number.isRequired,
    rolesFilter: PropTypes.object.isRequired,
    interestsFilter: PropTypes.object.isRequired,
    fetchListOfMembers: PropTypes.func.isRequired,
    updateInterestsFilter: PropTypes.func.isRequired,
  };

  onChange = type => e => {
    e.preventDefault();
    const { fetchListOfMembers, queryString, currentPage, membersPerPage, rolesFilter, interestsFilter, updateInterestsFilter } = this.props;

    fetchListOfMembers(queryString, {
      start: getCurrentStart(currentPage, membersPerPage),
      end: getCurrentEnd(currentPage, membersPerPage),
      roles: getSelectedFilter(rolesFilter),
      interests: getSelectedFilter({ ...interestsFilter, [type]: e.target.checked }),
    });

    updateInterestsFilter({ ...interestsFilter, [type]: e.target.checked });
  };

  handleClear = event => {
    event.stopPropagation();
    const { fetchListOfMembers, queryString, currentPage, membersPerPage, rolesFilter, updateInterestsFilter } = this.props;

    fetchListOfMembers(queryString, {
      start: getCurrentStart(currentPage, membersPerPage),
      end: getCurrentEnd(currentPage, membersPerPage),
      roles: getSelectedFilter(rolesFilter),
      interests: [],
    });

    updateInterestsFilter();
  };

  handleChangeFilterString = event => {
    this.setState({ filterSearchString: event.target.value });
  };

  toggleShowAll = () => {
    const {showAll} = this.state;
    this.setState({ showAll: !showAll });
  };

  render() {
    const { collapsed, count, interestsFilter } = this.props;
    const { filterSearchString, showAll } = this.state;

    return (
      <div>
        <FilterTable
          title={'Research Interests'}
          handleClear={this.handleClear}
          collapsed={collapsed}
          borderLeftColor={'#00afed'}
          showSearchDefault={true}
          handleChangeFilterString={this.handleChangeFilterString}
          showClear={getSelectedFilter(interestsFilter).length > 0}
        >
          <FilterTableList
            dataSource={count ? count.interests : {}}
            checkboxes={interestsFilter}
            onChange={this.onChange}
            keyDisplayNames={{}}
            searchString={filterSearchString}
            showAll={showAll}
            toggleShowAll={this.toggleShowAll}
          />
        </FilterTable>
      </div>
    );
  }
}

const mapStateToProps = state => ({
  count: state.ui.memberSearchPageReducer.count,
  rolesFilter: state.ui.memberSearchPageReducer.rolesFilter,
  interestsFilter: state.ui.memberSearchPageReducer.interestsFilter,
  queryString: state.ui.memberSearchPageReducer.queryString,
  currentPage: state.ui.memberSearchPageReducer.currentPage,
  membersPerPage: state.ui.memberSearchPageReducer.membersPerPage,
});

const mapDispatchToProps = dispatch =>
  bindActionCreators(
    {
      fetchListOfMembers: fetchListOfMembersAction,
      updateInterestsFilter: interestsFilter =>
        dispatch(requestInterestsFilterUpdate(interestsFilter)),
    },
    dispatch,
  );

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(InterestsFilter);
