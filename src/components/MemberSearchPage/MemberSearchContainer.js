import React, { Component } from 'react';
import { connect } from 'react-redux';
import fetchListOfMembersAction from 'components/MemberSearchPage/fetchListOfMembers';
import { bindActionCreators } from 'redux';
import { Icon, Input, Tooltip } from 'antd';
import MemberTable from './MemberTable';
import PropTypes from 'prop-types';
import MemberSearchBorder from 'components/MemberSearchPage/MemberSearchBorder';

class MemberSearchContainer extends Component {
  state = {
    queryString: '',
    currentPage: 1,
    membersPerPage: 10,
  };

  static propTypes = {
    pending: PropTypes.bool.isRequired,
    error: PropTypes.object,
    count: PropTypes.object,
    members: PropTypes.arrayOf(PropTypes.object),
  };

  getCurrentStart = (page = this.state.currentPage, pageSize = this.state.membersPerPage) => {
    return pageSize * (page - 1);
  };

  getCurrentEnd = (page = this.state.currentPage, pageSize = this.state.membersPerPage) => {
    return page * pageSize;
  };

  handleChange = e => {
    this.props.fetchListOfMembers(e.target.value, {
      start: this.getCurrentStart(this.state.currentPage),
      end: this.getCurrentEnd(this.state.currentPage),
    });
    this.setState({ queryString: e.target.value, currentPage: 1 });
  };

  componentDidMount() {
    this.props.fetchListOfMembers(this.state.queryString, {
      start: this.getCurrentStart(this.state.currentPage),
      end: this.getCurrentEnd(this.state.currentPage),
    });
  }

  handlePageChange = async page => {
    const maxPage = this.props.count.public / this.state.membersPerPage;

    if (!maxPage || page < 1 || page > Math.ceil(maxPage)) return;

    this.setState({ currentPage: page });

    this.props.fetchListOfMembers(this.state.queryString, {
      start: this.getCurrentStart(page),
      end: this.getCurrentEnd(page),
    });
  };

  handleShowSizeChange = async (current, pageSize) => {
    this.setState({ membersPerPage: pageSize, currentPage: current });

    this.props.fetchListOfMembers(this.state.queryString, {
      start: this.getCurrentStart(current, pageSize),
      end: this.getCurrentEnd(current, pageSize),
    });
  };

  render() {
    return (
      <MemberSearchBorder loggedInUser={this.props.loggedInUser}>
        <Input
          style={{ borderRadius: 30 }}
          onChange={this.handleChange}
          placeholder="Member Name, Email, Interests,..."
          prefix={<Icon type="search" style={{ color: 'rgba(0,0,0,.25)' }} />}
          suffix={
            <Tooltip title="Enter text to search for members">
              <Icon type="info-circle" style={{ color: 'rgba(0,0,0,.45)' }} />
            </Tooltip>
          }
        />
        <MemberTable
          memberList={this.props.members}
          count={this.props.count}
          currentPage={this.state.currentPage}
          membersPerPage={this.state.membersPerPage}
          handlePageChange={this.handlePageChange}
          handleShowSizeChange={this.handleShowSizeChange}
          pending={this.props.pending}
        />
      </MemberSearchBorder>
    );
  }
}

const mapStateToProps = state => ({
  error: state.ui.memberSearchPageReducer.errors,
  members: state.ui.memberSearchPageReducer.members,
  count: state.ui.memberSearchPageReducer.count,
  pending: state.ui.memberSearchPageReducer.pending,
  loggedInUser: state.user.loggedInUser,
});

const mapDispatchToProps = dispatch =>
  bindActionCreators(
    {
      fetchListOfMembers: fetchListOfMembersAction,
    },
    dispatch,
  );

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(MemberSearchContainer);
