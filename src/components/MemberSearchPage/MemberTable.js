import { Col, Icon, List, Row, Spin, Typography } from 'antd';
import React from 'react';
import { MemberImage } from 'components/MemberSearchPage/ui';
import './MemberSearchPage.css';
import FormatLabel from 'components/MemberSearchPage/FormatLabel';
import MemberInterests from 'components/MemberSearchPage/MemberIntersts';
import { Link } from 'uikit/Core';
import ROUTES from 'common/routes';
import MemberSearchBioStory from 'components/MemberSearchPage/MemberSearchBioStory';
import ProfilePill from 'components/MemberSearchPage/ProfilePill';

const { Text, Title } = Typography;

const Address = ({ item }) => (
  <div className={'flex'} style={{ alignItems: 'center' }}>
    {item.city || item.state || item.country ? (
      <Icon
        className={'icon-color'}
        type="environment"
        theme="filled"
        style={{ paddingRight: 8 }}
      />
    ) : (
      ''
    )}
    {item.city ? (
      <FormatLabel
        classname={'comma-address'}
        value={item.city}
        highLightValues={item.highlight ? item.highlight.city : null}
        index={1}
      />
    ) : (
      ''
    )}
    {item.state ? (
      <FormatLabel
        classname={'comma-address'}
        value={item.state}
        highLightValues={item.highlight ? item.highlight.state : null}
        index={2}
      />
    ) : (
      ''
    )}
    {item.country ? (
      <FormatLabel
        classname={'comma-address'}
        value={item.country}
        highLightValues={item.highlight ? item.highlight.country : null}
        index={3}
      />
    ) : (
      ''
    )}
  </div>
);

const MemberTable = props => {
  const firstItem = props.currentPage * props.membersPerPage - props.membersPerPage + 1;
  const lastItem = props.currentPage * props.membersPerPage;

  return (
    <div className={'member-list-container'} style={{ backgroundColor: 'white' }}>
      <List
        itemLayout={'vertical'}
        header={
          props.pending ? (
            <Spin />
          ) : (
            <Row style={{ marginTop: 12, marginBottom: 12 }}>
              <Col span={12} style={{ textAlign: 'left' }}>
                <Title level={3} style={{ margin: 0 }}>
                  {`Showing ${firstItem} - ${Math.min(lastItem, props.count.public)} of ${
                    props.count.public
                  } public members`}
                </Title>
              </Col>
              <Col span={12} style={{ textAlign: 'right' }}>
                <Title
                  level={3}
                  style={{ margin: 0 }}
                >{`${props.count.total} members total (public & private)`}</Title>
              </Col>
            </Row>
          )
        }
        gutter={20}
        style={{ color: '#343434' }} //TODO remove with Ant Design Theme
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
        renderItem={item => {
          const hasAddress = item.city || item.state || item.country;
          return (
            <List.Item key={item._id} style={{ paddingBottom: 32, paddingTop: 32 }}>
              <Row type={'flex'} justify="center" align="top" gutter={32} style={{ margin: 0 }}>
                <Col className={'flex'} style={{ width: 130, flexFlow: 'column nowrap' }}>
                  <MemberImage email={item.email || ''} d={'mp'} />
                  <div style={{ paddingTop: 10 }}>
                    {item.roles[0] ? <ProfilePill roles={item.roles} /> : ''}
                  </div>
                </Col>
                <Col style={{ left: 0, right: 0, flex: 1 }}>
                  <Link to={`${ROUTES.user}/${item._id}`}>
                    <div className={'flex member-info-title'}>
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
                  {hasAddress || item.institution ? (
                    <div style={{ paddingTop: 10 }}>
                      {item.institution ? (
                        <Row className={'flex'}>
                          <Icon
                            className={'icon-color'}
                            type="bank"
                            theme="filled"
                            style={{ paddingRight: 8 }}
                          />
                          <Text style={{ color: 'inherit' }}>{item.institution}</Text>
                        </Row>
                      ) : (
                        ''
                      )}

                      <Address item={item} />
                    </div>
                  ) : (
                    ''
                  )}
                  {item.interests.length < 1 ? (
                    ''
                  ) : (
                    <div style={{ color: 'inherit', paddingTop: 24 }}>
                      <MemberInterests
                        interests={item.interests}
                        highlights={(item.highlight || {}).interests || []}
                      />
                    </div>
                  )}

                  <MemberSearchBioStory
                    bio={(item.highlight || {}).bio || []}
                    story={(item.highlight || {}).story || []}
                  />
                </Col>
              </Row>
            </List.Item>
          );
        }}
      />
    </div>
  );
};

export default MemberTable;
