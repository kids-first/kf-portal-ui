import { Col, List, Row } from 'antd';
import React from 'react';
import { find } from 'lodash';
import { ROLES } from 'common/constants';
import { MemberImage } from 'components/MemberSearchPage/ui';
import './MemberSearchPage.css';

const userRoleDisplayName = userRole => find(ROLES, { type: userRole }).displayName;

/**
 * Formats a text value. Returns the same text value
 * with a portion of the text in bold.
 * @param {String}    value           Text to be formatted (ex. "xx abc yy")
 * @param {[String]}  highLightValues Array of highlighted texts
 * (ex. ["...", "xx <em>abc</em> yy", ".."]
 * @param index
 * @return {Object} (ex. <div>xx <b>abc</b> yy</div>
 */
const FormatLabel = ({ value, highLightValues, index }) => {
  if (!highLightValues) {
    return (
      <div key={index} className={'format-label'}>
        {value}
      </div>
    );
  }

  const isHighlight = (hit) => {
    return value === hit.replace(regex, '')
  };

  // eslint-disable-next-line no-unused-vars
  const [head, ...tail] = highLightValues.filter(isHighlight);

  if(head) {
    const arr = head.split(regex);
    const [first = '', second = '', third = ''] = arr;

    return(
      <div key={index} className={'format-label'}>
        {first}
        <b>{second}</b>
        {third}
      </div>
    )
  } else {
    return (
      <div key={index} className={'format-label'}>
        {value}
      </div>
    )
  }
};

const regex = /<\/?em>/gi;

const Address = ({ item }) => (
  <div className={'flex'}>
    <FormatLabel
      value={item.city}
      highLightValues={item.highlight ? item.highlight.city : null}
      index={1}
    />
    <FormatLabel
      value={item.state}
      highLightValues={item.highlight ? item.highlight.state : null}
      index={2}
    />
    <FormatLabel
      value={item.country}
      highLightValues={item.highlight ? item.highlight.country : null}
      index={3}
    />
  </div>
);

const MemberTable = props => {
  const firstItem = props.currentPage * props.membersPerPage - props.membersPerPage + 1;
  const lastItem = props.currentPage * props.membersPerPage;
  return (
    <div className={'member-list-container'}>
      <List
        itemLayout={'vertical'}
        header={`Showing ${firstItem} - ${Math.min(lastItem, props.count.public)} of ${
          props.count.public
        } (${props.count.total} members matching)`}
        pagination={{
          defaultPageSize: 10,
          showSizeChanger: true,
          pageSizeOptions: ['10', '20', '50'],
          defaultCurrent: 1,
          current: props.currentPage,
          total: props.count.public,
          pageSize: props.membersPerPage,
          onChange: props.handlePageChange,
          onShowSizeChange: props.handleShowSizeChange,
        }}
        className={'member-list'}
        dataSource={props.memberList}
        loading={props.pending}
        renderItem={item => (
          <List.Item key={item._id}>
            <Row type="flex" justify="space-around" align="middle" gutter={10}>
              <Col xxl={2} xl={3} lg={3} md={3} sm={4}>
                <MemberImage email={item.email || ''} d={'mp'} />
              </Col>
              <Col className={'member-list-col'} xxl={4} xl={6} lg={6} md={6} sm={8}>
                {item.roles[0] ? userRoleDisplayName(item.roles[0]) : 'NO ROLE'}
              </Col>
              <Col xxl={18} xl={15} lg={15} md={15} sm={12}>
                <a>
                  <div className={'flex'}>
                    {item.title ? (
                      <div key={0} style={{ paddingRight: 5 }}>
                        {item.title.toUpperCase()}
                      </div>
                    ) : (
                      ''
                    )}
                    <FormatLabel
                      value={item.firstName}
                      highLightValues={item.highlight ? item.highlight.firstName : null}
                      index={1}
                    />
                    <FormatLabel
                      value={item.lastName}
                      highLightValues={item.highlight ? item.highlight.lastName : null}
                      index={2}
                    />
                  </div>
                </a>
                <Address item={item} />
                <div className={'interest-container'}>
                  {item.interests.map((interest, index) => (
                    <FormatLabel
                      value={interest}
                      highLightValues={item.highlight ? item.highlight.interests : null}
                      key={index}
                    />
                  ))}
                </div>
              </Col>
            </Row>
          </List.Item>
        )}
      />
    </div>
  );
};

export default MemberTable;
