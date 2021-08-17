import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { bindActionCreators } from 'redux';

import {
  fetchListOfMembers,
  requestCurrentPageUpdate,
  requestInterestsFilterUpdate,
} from 'store/actionCreators/members';

import {
  selectAdminOptionsFilter,
  selectCounts,
  selectCurrentPage,
  selectInterestsFilter,
  selectMembersPerPage,
  selectQueryString,
  selectRolesFilter,
} from '../../store/selectors/members';

import FilterContainer from './FilterContainer';

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

  handleChangeFilterString = (event) => {
    this.setState({ filterSearchString: event.target.value });
  };

  toggleShowAll = () => {
    const { showAll } = this.state;
    this.setState({ showAll: !showAll });
  };

  render() {
    const { count, interestsFilter, updateInterestsFilter } = this.props;
    const { showAll, filterSearchString } = this.state;

    return (
      <FilterContainer
        title={'Research Interests'}
        filter={interestsFilter}
        showSearchDefault={true}
        searchString={filterSearchString}
        showAll={showAll}
        handleChangeFilterString={this.handleChangeFilterString}
        dataSource={count ? count.interests : {}}
        keyDisplayNames={{}}
        filterBoxName={'interests'}
        updateFilter={updateInterestsFilter}
        toggleShowAll={this.toggleShowAll}
        {...this.props}
      />
    );
  }
}

const mapStateToProps = (state) => ({
  count: selectCounts(state),
  rolesFilter: selectRolesFilter(state),
  interestsFilter: selectInterestsFilter(state),
  adminOptionsFilter: selectAdminOptionsFilter(state),
  queryString: selectQueryString(state),
  currentPage: selectCurrentPage(state),
  membersPerPage: selectMembersPerPage(state),
});

const mapDispatchToProps = (dispatch) =>
  bindActionCreators(
    {
      fetchListOfMembers: fetchListOfMembers,
      updateInterestsFilter: (interestsFilter) =>
        dispatch(requestInterestsFilterUpdate(interestsFilter)),
      currentPageUpdate: (currentPage) => dispatch(requestCurrentPageUpdate(currentPage)),
    },
    dispatch,
  );

export default connect(mapStateToProps, mapDispatchToProps)(InterestsFilter);
