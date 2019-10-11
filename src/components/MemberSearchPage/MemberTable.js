import { Col, List, Row } from 'antd';
import React from 'react';
import { find } from 'lodash';
import { ROLES } from 'common/constants';
import { MemberImage } from 'components/MemberSearchPage/ui';

const userRoleDisplayName = (userRole) => find(ROLES, { type: userRole }).displayName;

const regex = /<\/?em>/gi;
const regex2 = /<\/?em>.+<\/?em>/gi;


const formatLabel = (label, value) => {
  if (!value) {
    console.log("null");
    return label;
  }
  const arr = value.split(regex);

  if(arr.length < 3) {
    console.log("33333333");
    return label
  }

  return(
      <div>{arr[0]}<b>{arr[1]}</b>{arr[2]}</div>
  )
};

const address = (item) => {
  return(
    <span>
      <text>{item.highlights.city ? formatLabel(item.city, item.highlights.city[0]) : item.city} {item.highlights.state ? formatLabel(item.state, item.highlights.state[0]) : item.highlights.state } {item.highlights.country ? formatLabel(item.country, item.highlights.country[0]) : item.country}</text>
    </span>
  )
};

const interestFormat = (interest, highlights) => {
  if (!highlights) {
    return interest;
  }

  for(const h of highlights){
    if(interest === h.replace(regex, '')){
      return (<span>{formatLabel(interest, h)}</span>);
    }
  }

  return interest;
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
                <div>
                  <a>
                    {(item.title ? item.title.toUpperCase() + ' ' : '')} {item.highlights.firstName ? formatLabel(item.firstName, item.highlights.firstName[0]) : item.firstName} {item.highlights.lastName ? formatLabel(item.lastName, item.highlights.lastName[0]) : item.lastName}
                  </a>
                </div>
                {address(item)}
                {item.interests.map(interest => interestFormat(interest, item.highlights.interests))}
              </Col>
            </Row>
          </List.Item>
        )}
      />
    </div>
  );
};

export default MemberTable;