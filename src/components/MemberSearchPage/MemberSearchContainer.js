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
    pending: PropTypes.bool.isRequired,
    error: PropTypes.object,
    count: PropTypes.object,
    members: PropTypes.arrayOf(PropTypes.object),
  };

  handleChange = e => {
    this.props.fetchListOfMembers(e.target.value, {
      start: getCurrentStart(this.props.currentPage, this.props.membersPerPage),
      end: getCurrentEnd(this.props.currentPage, this.props.membersPerPage),
      roles: getSelectedFilter(this.props.rolesFilter),
      interests: getSelectedFilter(this.props.interestsFilter),
    });

    this.props.queryStringUpdate(e.target.value);
    this.props.currentPageUpdate(1);
  };

  componentDidMount() {
    this.props.fetchListOfMembers(this.props.queryString, {
      start: getCurrentStart(this.props.currentPage, this.props.membersPerPage),
      end: getCurrentEnd(this.props.currentPage, this.props.membersPerPage),
    });
  }

  handlePageChange = async page => {
    const maxPage = this.props.count.public / this.props.membersPerPage;

    if (!maxPage || page < 1 || page > Math.ceil(maxPage)) return;

    this.props.currentPageUpdate(page);

    this.props.fetchListOfMembers(this.props.queryString, {
      start: getCurrentStart(page, this.props.membersPerPage),
      end: getCurrentEnd(page, this.props.membersPerPage),
      roles: getSelectedFilter(this.props.rolesFilter),
      interests: getSelectedFilter(this.props.interestsFilter),
    });
  };

  handleShowSizeChange = async (current, pageSize) => {
    this.props.currentPageUpdate(current);
    this.props.membersPerPageUpdate(pageSize);

    this.props.fetchListOfMembers(this.props.queryString, {
      start: getCurrentStart(current, pageSize),
      end: getCurrentEnd(current, pageSize),
      roles: getSelectedFilter(this.props.rolesFilter),
      interests: getSelectedFilter(this.props.interestsFilter),
    });
  };

  render() {
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
              memberList={this.props.members}
              count={this.props.count}
              currentPage={this.props.currentPage}
              membersPerPage={this.props.membersPerPage}
              handlePageChange={this.handlePageChange} //FIXME Move to MemberTable
              handleShowSizeChange={this.handleShowSizeChange}
              pending={this.props.pending}
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
