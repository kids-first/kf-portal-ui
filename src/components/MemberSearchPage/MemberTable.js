import { Col, List, Row } from 'antd';
import React from 'react';
import { find, trim } from 'lodash';
import { ROLES } from 'common/constants';
import { MemberImage } from 'components/MemberSearchPage/ui';
import md5 from 'md5';

const userRoleDisplayName = (userRole) => find(ROLES, { type: userRole }).displayName;

const formatLabel = (label, value) => {
  if (!value) {
    return label;
  }
  return (<span>
    { label.split(value)
      .reduce((prev, current, i) => {
        if (!i) {
          return [current];
        }
        return prev.concat(<b key={value + current}>{ value }</b>, current);
      }, [])
    }
  </span>);
};

const MemberTable = (props) => {
  return (
    <div>
      <List
        itemLayout={"vertical"}
        header={
          `Showing 1-10 of ${props.memberList.length} (${props.totalCount} members matching)`
        }

        pagination={{
          defaultPageSize: 10,
          showSizeChanger: true,
          pageSizeOptions: ['10', '20', '50'],
          defaultCurrent: 1,
          // current: props.currentPage,
          total: 80, //TODO
          // pageSize: props.membersPerPage,
          onChange: props.handlePageChange,
          onShowSizeChange: props.handleShowSizeChange,
        }}

        dataSource={props.memberList}
        // loading={true}

        renderItem={item => (
          <List.Item key={item.title}>
            <Row>
              <Col span={6}>
                <Row type="flex" justify="space-around" align="middle"  >
                  <Col span={6}>
                    <MemberImage email={item.email || ''} d={"mp"}/>
                  </Col>
                  <Col span={18}>
                    <div style={{alignContent:'center', alignItems:'center'}}>{item.roles[0] ? userRoleDisplayName(item.roles[0]) : "NO ROLE"}</div>
                  </Col>
                </Row>
              </Col>
              <Col span={18}>
                <div>{formatLabel(item.firstName, 'Ad')}</div>
                <a>{(item.title ? item.title.toUpperCase() + ' ' : '') + formatLabel(item.firstName, 'Ad')+ ' ' + item.lastName}</a>
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