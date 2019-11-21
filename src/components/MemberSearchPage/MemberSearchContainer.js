import React, { Component } from 'react';
import { connect } from 'react-redux';
import fetchListOfMembersAction from 'components/MemberSearchPage/fetchListOfMembers';
import { bindActionCreators } from 'redux';
import { Icon, Input, Layout, Tooltip } from 'antd';
import MemberTable from './MemberTable';
import PropTypes from 'prop-types';
import MemberSearchBorder from 'components/MemberSearchPage/MemberSearchBorder';
import FilterDrawer from 'components/MemberSearchPage/FilterDrawer';
import {
  requestCurrentPageUpdate,
  requestMemberPerPageUpdate,
  requestQueryStringUpdate,
} from 'components/MemberSearchPage/actions';
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
    fetchListOfMembers: PropTypes.func.isRequired,
    currentPageUpdate: PropTypes.func.isRequired,
  };

  handleChange = e => {
    const { membersPerPage, fetchListOfMembers, queryStringUpdate, currentPageUpdate, currentPage, rolesFilter, interestsFilter} = this.props;

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
    const { membersPerPage, fetchListOfMembers, queryString, currentPage} = this.props;

    fetchListOfMembers(queryString, {
      start: getCurrentStart(currentPage, membersPerPage),
      end: getCurrentEnd(currentPage, membersPerPage),
    });
  }

  handlePageChange = async page => {
    const { count, membersPerPage, fetchListOfMembers, queryString, rolesFilter, interestsFilter, currentPageUpdate} = this.props;
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
    const { currentPageUpdate, membersPerPageUpdate, fetchListOfMembers, queryString, rolesFilter, interestsFilter} = this.props;

    currentPageUpdate(current);
    membersPerPageUpdate(pageSize);
    fetchListOfMembers(queryString, {
      start: getCurrentStart(current, pageSize),
      end: getCurrentEnd(current, pageSize),
      roles: getSelectedFilter(rolesFilter),
      interests: getSelectedFilter(interestsFilter),
    });
  };

  render() {
    const {members, count, currentPage ,membersPerPage, pending} = this.props;

    //TODO mode style to css class or default ant design theme
    return (
      <div style={{ backgroundColor: 'rgb(244, 245, 248)', width: '100%' }}>
        <Layout style={{ minHeight: '100vh' }}>
          <FilterDrawer />
          <MemberSearchBorder loggedInUser={this.props.loggedInUser}>
            <Input
              style={{ borderRadius: 30 }}
              onChange={this.handleChange}
              placeholder="Member Name, Email, Interests,..."
              prefix={<Icon type="search" style={{ color: 'rgba(0,0,0,.25)' }} />}
              allowClear={true}
              suffix={
                <Tooltip title="Enter text to search for members">
                  <Icon type="info-circle" style={{ color: 'rgba(0,0,0,.45)' }} />
                </Tooltip>
              }
            />
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
    },
    dispatch,
  );

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(MemberSearchContainer);
