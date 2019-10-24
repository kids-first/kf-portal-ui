import { Col, List, Row, Typography } from 'antd';
import React from 'react';
import { find } from 'lodash';
import { ROLES } from 'common/constants';
import { MemberImage } from 'components/MemberSearchPage/ui';
import './MemberSearchPage.css';
import FormatLabel from 'components/MemberSearchPage/FormatLabel';
import MemberInterests from 'components/MemberSearchPage/MemberIntersts';
import {Link} from 'uikit/Core';
import ROUTES from 'common/routes';

const { Text } = Typography;

const userRoleDisplayName = userRole => find(ROLES, { type: userRole }).displayName;

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
    <div className={'member-list-container'} style={{backgroundColor:'white'}}>
      <List
        itemLayout={'vertical'}
        header={<Row>
          <Col span={12} style={{textAlign:'left'}}>{`Showing ${firstItem} - ${Math.min(lastItem, props.count.public)} of ${
            props.count.public
          }`}</Col>
          <Col span={12} style={{textAlign:'right'}} >{`${props.count.total} members total (public & private)`}</Col>
        </Row>}
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
                <Link to={`${ROUTES.user}/${item._id}`}>
                  <div className={'flex'}>
                    {item.title ? (
                      <div key={0} style={{ paddingRight: 5 }}>
                        {item.title[0].toUpperCase() + item.title.slice(1) + '.'}
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
                </Link>
                <Text>{item.institution}</Text>
                <Address item={item} />
                <div>
                  {
                    item.interests.length < 1 ? (
                      ''
                    ) : (
                      <MemberInterests interests={item.interests} highlights={(item.highlight || {}).interests || [] } />
                    )
                  }
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
