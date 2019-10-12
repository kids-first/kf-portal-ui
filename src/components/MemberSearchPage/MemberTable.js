import { Col, List, Row } from 'antd';
import React from 'react';
import { find } from 'lodash';
import { ROLES } from 'common/constants';
import { MemberImage } from 'components/MemberSearchPage/ui';

const userRoleDisplayName = (userRole) => find(ROLES, { type: userRole }).displayName;

const regex = /<\/?em>/gi;

/**
 * Formats a text value. Returns the same text value
 * with a portion of the text in bold.
 * @param {String}    value           Text to be formatted (ex. "xx abc yy")
 * @param {[String]}  highLightValues Array of highlighted texts
 * (ex. ["...", "xx <em>abc</em> yy", ".."]
 * @return {Object} (ex. <div>xx <b>abc</b> yy</div>
 */
const formatLabel = (value, highLightValues) => {
  if (!highLightValues) {
    return <div>{value}</div>;
  }
  for(const h of highLightValues){
    if(value === h.replace(regex, '')){
      const arr = h.split(regex);
      if(arr.length >= 3) {
        const [first, second, third] = arr;

        return(
          <div>{first}<b>{second}</b>{third}</div>
        )
      }
    }
  }

  return <div>{value}</div>
};

const address = (item) => {
  return(
    <span>
      {formatLabel(item.city, item.highlights.city)} {formatLabel(item.state, item.highlights.state)} {formatLabel(item.country, item.highlights.country)}
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
                    <span>
                      {(item.title ? item.title.toUpperCase() + ' ' : '')} {formatLabel(item.firstName, item.highlights.firstName)} {formatLabel(item.lastName, item.highlights.lastName)}
                    </span>
                  </a>
                </div>
                {address(item)}
                {item.interests.map(interest => formatLabel(interest, item.highlights.interests))}
              </Col>
            </Row>
          </List.Item>
        )}
      />
    </div>
  );
};

export default MemberTable;