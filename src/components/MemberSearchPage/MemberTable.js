import { Col, List, Row } from 'antd';
import React from 'react';
import { find } from 'lodash';
import { ROLES } from 'common/constants';
import { MemberImage } from 'components/MemberSearchPage/ui';

const userRoleDisplayName = userRole => find(ROLES, { type: userRole }).displayName;

const regex = /<\/?em>/gi;

/**
 * Formats a text value. Returns the same text value
 * with a portion of the text in bold.
 * @param {String}    value           Text to be formatted (ex. "xx abc yy")
 * @param {[String]}  highLightValues Array of highlighted texts
 * (ex. ["...", "xx <em>abc</em> yy", ".."]
 * @param index
 * @return {Object} (ex. <div>xx <b>abc</b> yy</div>
 */
const formatLabel = (value, highLightValues, index = 0) => {
  if (!highLightValues) {
    return (
      <div key={index} style={{ paddingRight: 5, wordWrap: 'break-word', maxWidth: '100%' }}>
        {value}
      </div>
    );
  }
  for (const h of highLightValues) {
    if (value === h.replace(regex, '')) {
      const arr = h.split(regex);
      if (arr.length >= 3) {
        const [first, second, third] = arr;

        return (
          <div key={index} style={{ paddingRight: 5, wordWrap: 'break-word', maxWidth: '100%' }}>
            {first}
            <b>{second}</b>
            {third}
          </div>
        );
      }
    }
  }

  return (
    <div key={index} style={{ paddingRight: 5, wordWrap: 'break-word', maxWidth: '100%' }}>
      {value}
    </div>
  );
};

const address = item => {
  return (
    <div style={{ display: 'flex' }}>
      {formatLabel(item.city, item.highlight ? item.highlight.city : null, 1)}
      {formatLabel(item.state, item.highlight ? item.highlight.state : null, 2)}
      {formatLabel(item.country, item.highlight ? item.highlight.country : null, 3)}
    </div>
  );
};

const divStyle = {
  marginTop: '20px',
  marginBottom: '20px',
  border: '2px solid lightgrey',
  borderRadius: '5px',
};

const MemberTable = props => {
  const firstItem = props.currentPage * props.membersPerPage - props.membersPerPage + 1;
  const lastItem = props.currentPage * props.membersPerPage;
  return (
    <div style={divStyle}>
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
        style={{ margin: 20 }}
        dataSource={props.memberList}
        loading={props.pending}
        renderItem={item => (
          <List.Item key={item._id}>
            <Row type="flex" justify="space-around" align="middle" gutter={10}>
              <Col xxl={2} xl={3} lg={3} md={3} sm={4}>
                <MemberImage email={item.email || ''} d={'mp'} />
              </Col>
              <Col xxl={4} xl={6} lg={6} md={6} sm={8}>
                <div style={{ alignContent: 'center', alignItems: 'center' }}>
                  {item.roles[0] ? userRoleDisplayName(item.roles[0]) : 'NO ROLE'}
                </div>
              </Col>
              <Col xxl={18} xl={15} lg={15} md={15} sm={12}>
                <a>
                  <div style={{ display: 'flex' }}>
                    {item.title ? (
                      <div key={0} style={{ paddingRight: 5 }}>
                        {item.title.toUpperCase()}
                      </div>
                    ) : (
                      ''
                    )}
                    {formatLabel(
                      item.firstName,
                      item.highlight ? item.highlight.firstName : null,
                      1,
                    )}
                    {formatLabel(item.lastName, item.highlight ? item.highlight.lastName : null, 2)}
                  </div>
                </a>
                {address(item)}
                <div style={{ display: 'flex', alignItems: 'baseline', flexWrap: 'wrap' }}>
                  {item.interests.map((interest, index) =>
                    formatLabel(interest, item.highlight ? item.highlight.interests : null, index),
                  )}
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
