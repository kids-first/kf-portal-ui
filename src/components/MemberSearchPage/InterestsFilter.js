import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import fetchListOfMembersAction from 'components/MemberSearchPage/fetchListOfMembers';
import {
  requestCurrentPageUpdate,
  requestInterestsFilterUpdate,
} from 'components/MemberSearchPage/actions';
import PropTypes from 'prop-types';
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

  handleChangeFilterString = event => {
    this.setState({ filterSearchString: event.target.value });
  };

  toggleShowAll = () => {
    const { showAll } = this.state;
    this.setState({ showAll: !showAll });
  };

  render() {
    const { count, interestsFilter, updateInterestsFilter } = this.props;
    const { showAll } = this.state;

    return (
      <FilterContainer
        title={'Research Interests'}
        filter={interestsFilter}
        showSearchDefault={true}
        searchString={{}}
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

const mapStateToProps = state => ({
  count: state.ui.memberSearchPageReducer.count,
  rolesFilter: state.ui.memberSearchPageReducer.rolesFilter,
  interestsFilter: state.ui.memberSearchPageReducer.interestsFilter,
  adminOptionsFilter: state.ui.memberSearchPageReducer.adminOptionsFilter,
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
      currentPageUpdate: currentPage => dispatch(requestCurrentPageUpdate(currentPage)),
    },
    dispatch,
  );

export default connect(mapStateToProps, mapDispatchToProps)(InterestsFilter);
