import React, { Component } from 'react';
import { connect } from 'react-redux';
import fetchListOfMembersAction from 'components/MemberSearchPage/fetchListOfMembers';
import { bindActionCreators } from 'redux';
import { Col, Icon, Input, Row, Tooltip } from 'antd';
import MemberTable from './MemberTable';

class MemberSearchContainer extends Component {
  constructor(props) {
    super(props);
    this.handleChange = this.handleChange.bind(this)
  }
  static propTypes = {};

  handleChange(e) {
    const {fetchListOfMembers} = this.props;
    fetchListOfMembers(e.target.value, {start: 0, end: 50})
  } //FIXME

  componentDidMount() {
    const {fetchListOfMembers} = this.props;
    fetchListOfMembers("", {start: 0, end: 50})
  }//FIXME

  render() {
    //FIXME
    const memberList = this.props.members.map(row => ({
      key: row[0]._id,
      firstName: row[0].firstName,
      lastName: row[0].lastName,
      email: row[0].email,
      city: row[0].city,
      state: row[0].state,
      country: row[0].country,
      title: row[0].title,
      interests: row[0].interests,
      institution: row[0].institution,
      roles: row[0].roles
    }));
    return (
      <div id={"grid-container"}>
        <Row>
          <Col span={8}>
            TODO add table
          </Col>
          <Col span={16}>
            <p>Member Search</p>
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
            {console.log("ADRIAN")}
            {console.log(this.props)}
            {console.log("ADRIAN")}
            <MemberTable memberList={memberList} totalCount={this.props.totalCount}/>
          </Col>
        </Row>

      </div>

    );
  }


}

const mapStateToProps = state => ({
  error: state.ui.memberSearchPageReducer.errors,
  members: state.ui.memberSearchPageReducer.members,
  totalCount: state.ui.memberSearchPageReducer.totalCount,
  pending: state.ui.memberSearchPageReducer.pending,
});

const mapDispatchToProps = dispatch => bindActionCreators({
  fetchListOfMembers: fetchListOfMembersAction
}, dispatch);

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(MemberSearchContainer);