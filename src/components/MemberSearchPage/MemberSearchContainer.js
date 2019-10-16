import React, { Component } from 'react';
import { connect } from 'react-redux';
import fetchListOfMembersAction from 'components/MemberSearchPage/fetchListOfMembers';
import { bindActionCreators } from 'redux';
import { Col, Icon, Input, Row, Tooltip } from 'antd';
import MemberTable from './MemberTable';
import PropTypes from 'prop-types';

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

  static propTypes = {
    pending: PropTypes.bool,
    error: PropTypes.error,
    count: PropTypes.object,
    members: PropTypes.arrayOf(PropTypes.object),
  };


  getCurrentStart = () => {
    return (this.state.currentPage * this.state.membersPerPage - this.state.membersPerPage)
  };

  getCurrentEnd = () => {
    return (this.state.currentPage * this.state.membersPerPage)
  };

  handleChange(e) {
    this.props.fetchListOfMembers(e.target.value, {start: this.getCurrentStart(), end: this.getCurrentEnd()});
    this.setState({queryString: e.target.value, currentPage: 1})
  };

  componentDidMount() {
    this.setState({listHasLoaded: true});
    this.props.fetchListOfMembers(this.state.queryString, {start: this.getCurrentStart(), end: this.getCurrentEnd()})
  };

  handlePageChange = page => {
    const maxPage = this.props.count.public / this.state.membersPerPage;
    if (!maxPage || page < 1 || page > Math.ceil(maxPage)) return;
    this.setState(
      updatePage(page),
      () => this.props.fetchListOfMembers(this.state.queryString, {start: this.getCurrentStart(), end: this.getCurrentEnd()})
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
    return (
      <div id={"grid-container"}>
        <Row>
          {/*<Col span={6}>*/}
          {/*  TODO add filter tables here*/}
          {/*</Col>*/}
          <Col span={24}>
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
              memberList={this.props.members}
              count={this.props.count}
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