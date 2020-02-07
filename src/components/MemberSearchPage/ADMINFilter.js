import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import fetchListOfMembersAction from 'components/MemberSearchPage/fetchListOfMembers';
import {
  requestADMINOptionsUpdate,
  requestCurrentPageUpdate,
} from 'components/MemberSearchPage/actions';
import FilterTable from 'components/MemberSearchPage/FilterTable';
import FilterTableList from 'components/MemberSearchPage/FilterTableList';
import { getCurrentEnd, getCurrentStart, getSelectedFilter } from './utils';
import PropTypes from 'prop-types';

const ADMIN_OPTIONS = {
  allMembers: 'All Members',
};

class ADMINFilter extends Component {
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

  onChange = type => e => {
    e.preventDefault();
    const {
      fetchListOfMembers,
      queryString,
      membersPerPage,
      rolesFilter,
      interestsFilter,
      adminOptionsFilter,
      updateADMINOptionsFilter,
      currentPageUpdate,
    } = this.props;

    fetchListOfMembers(queryString, {
      start: getCurrentStart(1, membersPerPage),
      end: getCurrentEnd(1, membersPerPage),
      roles: getSelectedFilter(rolesFilter),
      interests: getSelectedFilter(interestsFilter),
      adminMemberOptions: getSelectedFilter({ ...adminOptionsFilter, [type]: e.target.checked }),
    });

    currentPageUpdate(1);
    updateADMINOptionsFilter({ ...adminOptionsFilter, [type]: e.target.checked });
  };

  handleClear = event => {
    event.stopPropagation();
    const {
      fetchListOfMembers,
      queryString,
      currentPage,
      membersPerPage,
      rolesFilter,
      updateADMINOptionsFilter,
      currentPageUpdate,
    } = this.props;

    fetchListOfMembers(queryString, {
      start: getCurrentStart(currentPage, membersPerPage),
      end: getCurrentEnd(currentPage, membersPerPage),
      roles: getSelectedFilter(rolesFilter),
      interests: [],
      adminMemberOptions: [],
    });

    currentPageUpdate(1);
    updateADMINOptionsFilter();
  };

  handleChangeFilterString = event => {
    this.setState({ filterSearchString: event.target.value });
  };

  render() {
    const { collapsed, count, adminOptionsFilter } = this.props;

    return (
      <div>
        <FilterTable
          title={'Member Search Options'}
          handleClear={this.handleClear}
          collapsed={collapsed}
          borderLeftColor={'#ff9324'}
          showSearchDefault={false}
          handleChangeFilterString={this.handleChangeFilterString}
          showClear={getSelectedFilter(adminOptionsFilter).length > 0}
        >
          <FilterTableList
            dataSource={{
              allMembers: `${count.total}`,
            }}
            checkboxes={adminOptionsFilter}
            onChange={this.onChange}
            keyDisplayNames={ADMIN_OPTIONS}
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

export default connect(mapStateToProps, mapDispatchToProps)(ADMINFilter);
