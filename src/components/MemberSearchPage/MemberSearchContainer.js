import React, { Component } from 'react';
import { connect } from 'react-redux';
import fetchListOfMembersAction from 'components/MemberSearchPage/fetchListOfMembers';
import { bindActionCreators } from 'redux';
import { Icon, Input, Layout } from 'antd';
import MemberTable from './MemberTable';
import PropTypes from 'prop-types';
import MemberSearchBorder from 'components/MemberSearchPage/MemberSearchBorder';
import FilterDrawer from 'components/MemberSearchPage/FilterDrawer';
import {
  requestCurrentPageUpdate,
  requestInterestsFilterUpdate,
  requestMemberPerPageUpdate,
  requestQueryStringUpdate,
  requestRolesFilterUpdate,
  requestResetStore,
} from 'components/MemberSearchPage/actions';
import { getCurrentEnd, getCurrentStart, getSelectedFilter } from './utils';
import FilterTagContainer from 'components/MemberSearchPage/FilterTagContainer';

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
    fetchListOfMembers: PropTypes.func.isRequired,
    currentPageUpdate: PropTypes.func.isRequired,
    updateRolesFilter: PropTypes.func.isRequired,
    updateInterestsFilter: PropTypes.func.isRequired,
  };

  handleChange = e => {
    const {
      membersPerPage,
      fetchListOfMembers,
      queryStringUpdate,
      currentPageUpdate,
      currentPage,
      rolesFilter,
      interestsFilter,
    } = this.props;

    fetchListOfMembers(e.target.value, {
      start: getCurrentStart(currentPage, membersPerPage),
      end: getCurrentEnd(currentPage, membersPerPage),
      roles: getSelectedFilter(rolesFilter),
      interests: getSelectedFilter(interestsFilter),
    });

    queryStringUpdate(e.target.value);
    currentPageUpdate(1);
  };

  componentDidMount() {
    const { membersPerPage, fetchListOfMembers, queryString, currentPage } = this.props;

    fetchListOfMembers(queryString, {
      start: getCurrentStart(currentPage, membersPerPage),
      end: getCurrentEnd(currentPage, membersPerPage),
    });
  }

  componentWillUnmount() {
    this.props.resetStore();
  }

  handlePageChange = async page => {
    const {
      count,
      membersPerPage,
      fetchListOfMembers,
      queryString,
      rolesFilter,
      interestsFilter,
      currentPageUpdate,
    } = this.props;
    const maxPage = count.public / membersPerPage;

    if (!maxPage || page < 1 || page > Math.ceil(maxPage)) return;

    currentPageUpdate(page);

    fetchListOfMembers(queryString, {
      start: getCurrentStart(page, membersPerPage),
      end: getCurrentEnd(page, membersPerPage),
      roles: getSelectedFilter(rolesFilter),
      interests: getSelectedFilter(interestsFilter),
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
    } = this.props;

    currentPageUpdate(current);
    membersPerPageUpdate(pageSize);
    fetchListOfMembers(queryString, {
      start: getCurrentStart(current, pageSize),
      end: getCurrentEnd(current, pageSize),
      roles: getSelectedFilter(rolesFilter),
      interests: getSelectedFilter(interestsFilter),
    });
  };

  clearTag = (value, type) => e => {
    e.preventDefault();

    const filter = { [value]: false };
    const {
      fetchListOfMembers,
      queryString,
      currentPage,
      membersPerPage,
      rolesFilter,
      interestsFilter,
      updateInterestsFilter,
      updateRolesFilter,
    } = this.props;

    fetchListOfMembers(queryString, {
      start: getCurrentStart(currentPage, membersPerPage),
      end: getCurrentEnd(currentPage, membersPerPage),
      roles: getSelectedFilter(type === 'role' ? { ...rolesFilter, ...filter } : rolesFilter),
      interests: getSelectedFilter(
        type === 'interest' ? { ...interestsFilter, ...filter } : interestsFilter,
      ),
    });

    type === 'role'
      ? updateRolesFilter({ ...rolesFilter, ...filter })
      : updateInterestsFilter({ ...interestsFilter, ...filter });
  };

  render() {
    const { members, count, currentPage, membersPerPage, pending } = this.props;
    const filters = {
      roles: [...getSelectedFilter(this.props.rolesFilter)],
      interests: [...getSelectedFilter(this.props.interestsFilter)],
    };

    return (
      <div className="background-container">
        <Layout style={{ minHeight: '100vh' }}>
          <FilterDrawer />
          <MemberSearchBorder loggedInUser={this.props.loggedInUser} isAdmin={this.props.isAdmin}>
            <Input
              onChange={this.handleChange}
              placeholder="Member Name, Address, Email, Interests, Member Biography or Story"
              prefix={<Icon type="search" style={{ color: 'rgba(0,0,0,.25)' }} />}
              allowClear={true}
            />
            {(filters.roles && filters.roles.length > 0) ||
            (filters.interests && filters.interests.length > 0) ? (
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
            />
          </MemberSearchBorder>
        </Layout>
      </div>
    );
  }
}

const mapStateToProps = state => ({
  error: state.ui.memberSearchPageReducer.errors,
  members: state.ui.memberSearchPageReducer.members,
  count: state.ui.memberSearchPageReducer.count,
  pending: state.ui.memberSearchPageReducer.pending,
  loggedInUser: state.user.loggedInUser,
  queryString: state.ui.memberSearchPageReducer.queryString,
  currentPage: state.ui.memberSearchPageReducer.currentPage,
  membersPerPage: state.ui.memberSearchPageReducer.membersPerPage,
  rolesFilter: state.ui.memberSearchPageReducer.rolesFilter,
  interestsFilter: state.ui.memberSearchPageReducer.interestsFilter,
});

const mapDispatchToProps = dispatch =>
  bindActionCreators(
    {
      fetchListOfMembers: fetchListOfMembersAction,
      queryStringUpdate: queryString => dispatch(requestQueryStringUpdate(queryString)),
      currentPageUpdate: currentPage => dispatch(requestCurrentPageUpdate(currentPage)),
      membersPerPageUpdate: membersPerPage => dispatch(requestMemberPerPageUpdate(membersPerPage)),
      updateInterestsFilter: interestsFilter =>
        dispatch(requestInterestsFilterUpdate(interestsFilter)),
      updateRolesFilter: roleFilter => dispatch(requestRolesFilterUpdate(roleFilter)),
      resetStore: () => dispatch(requestResetStore()),
    },
    dispatch,
  );

export default connect(mapStateToProps, mapDispatchToProps)(MemberSearchContainer);
