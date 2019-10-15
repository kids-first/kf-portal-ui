import React, { Component } from 'react';
import { connect } from 'react-redux';
import fetchListOfMembersAction from 'components/MemberSearchPage/fetchListOfMembers';
import { bindActionCreators } from 'redux';
import { Col, Icon, Input, Row, Tooltip } from 'antd';
import MemberTable from './MemberTable';

const PAGE_COUNT = 10;

function updatePage(page) {
  return (previousState, currentProps) => {
    return { ...previousState, currentPage: page };
  };
}

function updatePageSize(current, size) {
  return (previousState, currentProps) => {
    return { ...previousState, membersPerPage: size, currentPage: current };
  };
}

class MemberSearchContainer extends Component {
  constructor(props) {
    super(props);
    this.state = {
      queryString: '',
      currentPage: 1,
      membersPerPage: 10,
      listHasLoaded: false,
    };
    this.handleChange = this.handleChange.bind(this);
    this.handlePageChange = this.handlePageChange.bind(this);
    this.handleShowSizeChange = this.handleShowSizeChange.bind(this);
  }
  static propTypes = {};


  getCurrentStart = () => {
    return (this.state.currentPage * this.state.membersPerPage - this.state.membersPerPage)
  };

  getCurrentEnd = () => {
    return (this.state.currentPage * this.state.membersPerPage)
  };

  handleChange(e) {
    const {fetchListOfMembers} = this.props;
    fetchListOfMembers(e.target.value, {start: this.getCurrentStart(), end: this.getCurrentEnd()});
    this.setState({queryString: e.target.value})
  }; //FIXME

  componentDidMount() {
    this.setState({listHasLoaded: true});
    const {fetchListOfMembers} = this.props;
    fetchListOfMembers(this.state.queryString, {start: this.getCurrentStart(), end: this.getCurrentEnd()})
  };//FIXME

  handlePageChange = page => {
    if (page < 1 || page > PAGE_COUNT) return; //FIXME
    const {fetchListOfMembers} = this.props;
    this.setState(
      updatePage(page),
      () => fetchListOfMembers(this.state.queryString, {start: this.getCurrentStart(), end: this.getCurrentEnd()})
    );
  }; //FIXME maybe use componentDidUpdate in lieu...

  handleShowSizeChange(current, pageSize) {
    const {fetchListOfMembers} = this.props;
    this.setState(
      updatePageSize(current, pageSize),
      () => fetchListOfMembers(this.state.queryString, {start: this.getCurrentStart(), end: this.getCurrentEnd()})
    );
  }

  render() {
    //FIXME
    const memberList = this.props.members.map(row => ({
      key: row._id,
      firstName: row.firstName,
      lastName: row.lastName,
      email: row.email,
      city: row.city,
      state: row.state,
      country: row.country,
      title: row.title,
      interests: row.interests,
      institution: row.institution,
      roles: row.roles,
      highlights: row.highlight,
    }));
    const memberCount = this.props.count;
    return (
      <div id={"grid-container"}>
        <Row>
          <Col span={6}>
            TODO add table
          </Col>
          <Col span={18}>
            <Input
              style={{borderRadius: 30}}
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
              memberList={memberList}
              count={memberCount}
              currentPage={this.state.currentPage}
              membersPerPage={this.state.membersPerPage}
              handlePageChange={this.handlePageChange}
              handleShowSizeChange={this.handleShowSizeChange}
              pending={this.props.pending}
            />
          </Col>
        </Row>
      </div>
    );
  }
}

const mapStateToProps = state => ({
  error: state.ui.memberSearchPageReducer.errors,
  members: state.ui.memberSearchPageReducer.members,
  count: state.ui.memberSearchPageReducer.count,
  pending: state.ui.memberSearchPageReducer.pending,
});

const mapDispatchToProps = dispatch => bindActionCreators({
  fetchListOfMembers: fetchListOfMembersAction
}, dispatch);

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(MemberSearchContainer);