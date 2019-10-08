import React, { Component } from 'react';
import { connect} from 'react-redux';
import MemberSearch from './MemberSearch';
// import reducer from '@kfarranger/admin-ui/src/store/configEditorReducer/index';
import  fetchListOfMembersAction  from 'components/MemberSearchPage/fetchListOfMembers';
import { bindActionCreators } from 'redux';
import { Row, Col, Input, Tooltip, Icon } from 'antd';
import MemberTable from './MemberTable'

class MemberSearchContainer extends Component {
  constructor(props) {
    super(props);
    this.handleChange = this.handleChange.bind(this)
  }
  static propTypes = {};

  handleChange(e) {
    const {fetchListOfMembers} = this.props;
    fetchListOfMembers(e.target.value, {start: 0, end: 10})
  } //FIXME

  componentDidMount() {
    const {fetchListOfMembers} = this.props;
    fetchListOfMembers("", {start: 0, end: 10})
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
              onChange={this.handleChange}
              placeholder="Member Name, Email, Interests,..."
              prefix={<Icon type="search" style={{ color: 'rgba(0,0,0,.25)' }} />}
              suffix={
                <Tooltip title="Enter text to search for members">
                  <Icon type="info-circle" style={{ color: 'rgba(0,0,0,.45)' }} />
                </Tooltip>
              }
            />
            <MemberTable memberList={memberList}/>
          </Col>
        </Row>

      </div>

    );
  }


}

const mapStateToProps = state => ({
  error: state.ui.memberSearchPageReducer.errors,
  members: state.ui.memberSearchPageReducer.members,
  pending: state.ui.memberSearchPageReducer.pending,
});

const mapDispatchToProps = dispatch => bindActionCreators({
  fetchListOfMembers: fetchListOfMembersAction
}, dispatch);

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(MemberSearchContainer);