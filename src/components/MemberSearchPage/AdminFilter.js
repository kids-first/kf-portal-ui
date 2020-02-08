import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import fetchListOfMembersAction from 'components/MemberSearchPage/fetchListOfMembers';
import { requestADMINOptionsUpdate, requestCurrentPageUpdate } from 'components/MemberSearchPage/actions';
import PropTypes from 'prop-types';
import FilterContainer from './FilterContainer';
import { ADMIN_OPTIONS } from '../../common/constants';

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

const mapStateToProps = state => ({
  count: state.ui.memberSearchPageReducer.count,
  rolesFilter: state.ui.memberSearchPageReducer.rolesFilter,
  interestsFilter: state.ui.memberSearchPageReducer.interestsFilter,
  queryString: state.ui.memberSearchPageReducer.queryString,
  currentPage: state.ui.memberSearchPageReducer.currentPage,
  membersPerPage: state.ui.memberSearchPageReducer.membersPerPage,
  adminOptionsFilter: state.ui.memberSearchPageReducer.adminOptionsFilter,
});

const mapDispatchToProps = dispatch =>
  bindActionCreators(
    {
      fetchListOfMembers: fetchListOfMembersAction,
      updateADMINOptionsFilter: adminOptionsFilter =>
        dispatch(requestADMINOptionsUpdate(adminOptionsFilter)),
      currentPageUpdate: currentPage => dispatch(requestCurrentPageUpdate(currentPage)),
    },
    dispatch,
  );

export default connect(mapStateToProps, mapDispatchToProps)(AdminFilter);
