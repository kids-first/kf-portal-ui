import React, { Component } from 'react';
import { connect } from 'react-redux';
import { SearchOutlined } from '@ant-design/icons';
import { Input, Layout } from 'antd';
import PropTypes from 'prop-types';
import { bindActionCreators } from 'redux';

import FilterDrawer from 'components/MemberSearchPage/FilterDrawer';
import FilterTagContainer from 'components/MemberSearchPage/FilterTagContainer';
import MemberSearchBorder from 'components/MemberSearchPage/MemberSearchBorder';
import {
  fetchListOfMembers,
  requestADMINOptionsUpdate,
  requestCurrentPageUpdate,
  requestInterestsFilterUpdate,
  requestMemberPerPageUpdate,
  requestQueryStringUpdate,
  requestResetStore,
  requestRolesFilterUpdate,
} from 'store/actionCreators/members';
import {
  selectAdminOptionsFilter,
  selectCounts,
  selectCurrentPage,
  selectInterestsFilter,
  selectIsPending,
  selectMemberErrors,
  selectMembers,
  selectMembersPerPage,
  selectQueryString,
  selectRolesFilter,
} from 'store/selectors/members';
import { selectIsUserAdmin } from 'store/selectors/users';

import MemberTable from './MemberTable';
import { getCurrentEnd, getCurrentStart, getSelectedFilter } from './utils';

class MemberSearchContainer extends Component {
  static propTypes = {
    pending: PropTypes.bool,
    error: PropTypes.object,
    count: PropTypes.object,
    queryString: PropTypes.string.isRequired,
    currentPage: PropTypes.number.isRequired,
    membersPerPage: PropTypes.number.isRequired,
    rolesFilter: PropTypes.object.isRequired,
    interestsFilter: PropTypes.object.isRequired,
    adminOptionsFilter: PropTypes.object,
    fetchListOfMembers: PropTypes.func.isRequired,
    currentPageUpdate: PropTypes.func.isRequired,
    membersPerPageUpdate: PropTypes.func.isRequired,
    updateRolesFilter: PropTypes.func.isRequired,
    updateInterestsFilter: PropTypes.func.isRequired,
    updateADMINOptionsFilter: PropTypes.func.isRequired,
    queryStringUpdate: PropTypes.func.isRequired,
    isAdmin: PropTypes.bool,
    members: PropTypes.array.isRequired,
  };

  handleChange = (e) => {
    const {
      membersPerPage,
      fetchListOfMembers,
      queryStringUpdate,
      currentPageUpdate,
      currentPage,
      rolesFilter,
      interestsFilter,
      adminOptionsFilter,
    } = this.props;

    fetchListOfMembers(e.target.value, {
      start: getCurrentStart(currentPage, membersPerPage),
      end: getCurrentEnd(currentPage, membersPerPage),
      roles: getSelectedFilter(rolesFilter),
      interests: getSelectedFilter(interestsFilter),
      adminMemberOptions: getSelectedFilter(adminOptionsFilter),
    });

    queryStringUpdate(e.target.value);
    currentPageUpdate(1);
  };

  componentDidMount() {
    const {
      membersPerPage,
      fetchListOfMembers,
      queryString,
      currentPage,
      rolesFilter,
      interestsFilter,
      adminOptionsFilter,
    } = this.props;

    fetchListOfMembers(queryString, {
      start: getCurrentStart(currentPage, membersPerPage),
      end: getCurrentEnd(currentPage, membersPerPage),
      roles: getSelectedFilter(rolesFilter),
      interests: getSelectedFilter(interestsFilter),
      adminMemberOptions: getSelectedFilter(adminOptionsFilter),
    });
  }

  handlePageChange = async (page) => {
    const {
      count,
      membersPerPage,
      fetchListOfMembers,
      queryString,
      rolesFilter,
      interestsFilter,
      adminOptionsFilter,
      currentPageUpdate,
      isAdmin,
    } = this.props;

    const showAll = adminOptionsFilter.allMembers && isAdmin;

    const maxPage = (showAll ? count.total : count.public) / membersPerPage;

    if (!maxPage || page < 1 || page > Math.ceil(maxPage)) return;

    currentPageUpdate(page);

    fetchListOfMembers(queryString, {
      start: getCurrentStart(page, membersPerPage),
      end: getCurrentEnd(page, membersPerPage),
      roles: getSelectedFilter(rolesFilter),
      interests: getSelectedFilter(interestsFilter),
      adminMemberOptions: getSelectedFilter(adminOptionsFilter),
    });
  };

  handleShowSizeChange = async (current, pageSize) => {
    const {
      currentPageUpdate,
      membersPerPageUpdate,
      fetchListOfMembers,
      queryString,
      rolesFilter,
      interestsFilter,
      adminOptionsFilter,
    } = this.props;

    currentPageUpdate(current);
    membersPerPageUpdate(pageSize);
    fetchListOfMembers(queryString, {
      start: getCurrentStart(current, pageSize),
      end: getCurrentEnd(current, pageSize),
      roles: getSelectedFilter(rolesFilter),
      interests: getSelectedFilter(interestsFilter),
      adminMemberOptions: getSelectedFilter(adminOptionsFilter),
    });
  };

  clearTag = (value, type) => (e) => {
    e.preventDefault();

    const filter = { [value]: false };
    const {
      fetchListOfMembers,
      queryString,
      currentPage,
      membersPerPage,
      rolesFilter,
      interestsFilter,
      adminOptionsFilter,
      updateInterestsFilter,
      updateRolesFilter,
      updateADMINOptionsFilter,
    } = this.props;

    fetchListOfMembers(queryString, {
      start: getCurrentStart(currentPage, membersPerPage),
      end: getCurrentEnd(currentPage, membersPerPage),
      roles: getSelectedFilter(type === 'role' ? { ...rolesFilter, ...filter } : rolesFilter),
      interests: getSelectedFilter(
        type === 'interest' ? { ...interestsFilter, ...filter } : interestsFilter,
      ),
      adminMemberOptions: getSelectedFilter(
        type === 'adminMemberOptions' ? { ...adminOptionsFilter, ...filter } : adminOptionsFilter,
      ),
    });

    switch (type) {
      case 'role':
        updateRolesFilter({ ...rolesFilter, ...filter });
        break;
      case 'adminMemberOptions':
        updateADMINOptionsFilter({ ...adminOptionsFilter, ...filter });
        break;
      default:
        updateInterestsFilter({ ...interestsFilter, ...filter });
    }
  };

  render() {
    const { members, count, currentPage, membersPerPage, pending } = this.props;
    const filters = {
      roles: [...getSelectedFilter(this.props.rolesFilter)],
      interests: [...getSelectedFilter(this.props.interestsFilter)],
      adminMemberOptions: [...getSelectedFilter(this.props.adminOptionsFilter)],
    };

    const { isAdmin } = this.props;
    const showAll =
      filters.adminMemberOptions && filters.adminMemberOptions.includes('allMembers') && isAdmin;

    return (
      <div className="background-container">
        <Layout style={{ minHeight: '100vh' }}>
          <FilterDrawer isAdmin={isAdmin} />
          <MemberSearchBorder isAdmin={isAdmin}>
            <Input
              onChange={this.handleChange}
              placeholder="Member Name, Address, Institution/Organization,
              Interests, Member Biography or Story"
              prefix={<SearchOutlined style={{ color: 'rgba(0,0,0,.25)' }} />}
              allowClear={true}
            />
            {(filters.roles && filters.roles.length > 0) ||
            (filters.interests && filters.interests.length > 0) ||
            (filters.adminMemberOptions && filters.adminMemberOptions.length > 0) ? (
              <FilterTagContainer filters={filters} clearTag={this.clearTag} />
            ) : (
              ''
            )}
            <MemberTable
              memberList={members}
              count={count}
              currentPage={currentPage}
              membersPerPage={membersPerPage}
              handlePageChange={this.handlePageChange}
              handleShowSizeChange={this.handleShowSizeChange}
              pending={pending}
              showAll={showAll}
              isAdmin={isAdmin}
            />
          </MemberSearchBorder>
        </Layout>
      </div>
    );
  }
}

const mapStateToProps = (state) => ({
  error: selectMemberErrors(state),
  members: selectMembers(state),
  count: selectCounts(state),
  pending: selectIsPending(state),
  queryString: selectQueryString(state),
  currentPage: selectCurrentPage(state),
  membersPerPage: selectMembersPerPage(state),
  rolesFilter: selectRolesFilter(state),
  interestsFilter: selectInterestsFilter(state),
  adminOptionsFilter: selectAdminOptionsFilter(state),
  isAdmin: selectIsUserAdmin(state),
});

const mapDispatchToProps = (dispatch) =>
  bindActionCreators(
    {
      fetchListOfMembers: fetchListOfMembers,
      queryStringUpdate: (queryString) => dispatch(requestQueryStringUpdate(queryString)),
      currentPageUpdate: (currentPage) => dispatch(requestCurrentPageUpdate(currentPage)),
      membersPerPageUpdate: (membersPerPage) =>
        dispatch(requestMemberPerPageUpdate(membersPerPage)),
      updateInterestsFilter: (interestsFilter) =>
        dispatch(requestInterestsFilterUpdate(interestsFilter)),
      updateRolesFilter: (roleFilter) => dispatch(requestRolesFilterUpdate(roleFilter)),
      updateADMINOptionsFilter: (adminOptionsFilter) =>
        dispatch(requestADMINOptionsUpdate(adminOptionsFilter)),
      resetStore: () => dispatch(requestResetStore()),
    },
    dispatch,
  );

export default connect(mapStateToProps, mapDispatchToProps)(MemberSearchContainer);
