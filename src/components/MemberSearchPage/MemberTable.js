import { Col, List, Row } from 'antd';
import React from 'react';
import { find } from 'lodash';
import { ROLES } from 'common/constants';
import { MemberImage } from 'components/MemberSearchPage/ui';

const userRoleDisplayName = (userRole) => find(ROLES, { type: userRole }).displayName;

function renderButton() {
  if(this.state.mode === 'view') {
    return (
      <button onClick={this.handleEdit}>
        Edit
      </button>
    );
  } else {
    return (
      <button onClick={this.handleSave}>
        Save
      </button>
    );
  }
}

const MemberTable = (props) => {
  return (
    <div>
      <List
        itemLayout={"vertical"}
        header={
          `Showing 1-10 of ${props.memberList.length} (${props.totalCount} members matching)`
        }
        pagination={{defaultPageSize: 10, showSizeChanger: true, pageSizeOptions: ['10', '20', '50'], defaultCurrent: 1, total: props.memberList.length}}
        dataSource={props.memberList}
        // loading={true}

        renderItem={item => (
          <List.Item key={item.title}>
            <Row>
              <Col span={6}>
                <Row type="flex" justify="space-around" align="middle">
                  <Col span={6}>
                    <MemberImage email={item.email || ''} d={"mp"}/>
                  </Col>
                  <Col span={18}>
                    <div style={{alignContent:'center', alignItems:'center'}}>{item.roles[0] ? userRoleDisplayName(item.roles[0]) : "NO ROLE"}</div>
                  </Col>
                </Row>
              </Col>
              <Col span={18}>
                <a>{(item.title ? item.title.toUpperCase() + ' ' : '') + item.firstName + ' ' + item.lastName}</a>
                <div>Address: {[item.city, item.state, item.country].filter(Boolean).join(", ")}</div>
                <div>Research Interests: {item.interests.join(", ")}</div>
              </Col>
            </Row>
          </List.Item>
        )}

      />
    </div>
  );
};

export default MemberTable;