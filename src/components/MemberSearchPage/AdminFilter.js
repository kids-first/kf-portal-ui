import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { bindActionCreators } from 'redux';

import {
  fetchListOfMembers,
  requestADMINOptionsUpdate,
  requestCurrentPageUpdate,
} from 'store/actionCreators/members';

import { ADMIN_OPTIONS } from '../../common/constants';
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

class AdminFilter extends Component {
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
    adminOptionsFilter: PropTypes.object.isRequired,
    fetchListOfMembers: PropTypes.func.isRequired,
    updateADMINOptionsFilter: PropTypes.func.isRequired,
  };

  render() {
    const { count, updateADMINOptionsFilter, adminOptionsFilter } = this.props;

    return (
      <FilterContainer
        title={'Member Search Options'}
        filter={adminOptionsFilter}
        showSearchDefault={false}
        handleChangeFilterString={{}}
        dataSource={{
          allMembers: `${count.total}`,
        }}
        keyDisplayNames={ADMIN_OPTIONS}
        filterBoxName={'adminMemberOptions'}
        updateFilter={updateADMINOptionsFilter}
        {...this.props}
      />
    );
  }
}

const mapStateToProps = (state) => ({
  count: selectCounts(state),
  rolesFilter: selectRolesFilter(state),
  interestsFilter: selectInterestsFilter(state),
  queryString: selectQueryString(state),
  currentPage: selectCurrentPage(state),
  membersPerPage: selectMembersPerPage(state),
  adminOptionsFilter: selectAdminOptionsFilter(state),
});

const mapDispatchToProps = (dispatch) =>
  bindActionCreators(
    {
      fetchListOfMembers: fetchListOfMembers,
      updateADMINOptionsFilter: (adminOptionsFilter) =>
        dispatch(requestADMINOptionsUpdate(adminOptionsFilter)),
      currentPageUpdate: (currentPage) => dispatch(requestCurrentPageUpdate(currentPage)),
    },
    dispatch,
  );

export default connect(mapStateToProps, mapDispatchToProps)(AdminFilter);
