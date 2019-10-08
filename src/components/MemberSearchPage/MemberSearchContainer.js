import React, { Component } from 'react';
import { connect} from 'react-redux';
import MemberSearch from './MemberSearch';
// import reducer from '@kfarranger/admin-ui/src/store/configEditorReducer/index';
import  fetchListOfMembersAction  from 'components/MemberSearchPage/fetchListOfMembers';
import { bindActionCreators } from 'redux';
import { Row, Col, Input, Tooltip, Icon } from 'antd';
import MemeberTable from './MemberTable'

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

  render() {
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
            <MemeberTable></MemeberTable>
            <ul>
              {this.props.members.map((member, index) => <div key={index}>{member[0].firstName}</div>)}

            </ul>

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