import { BankFilled, EnvironmentFilled } from '@ant-design/icons';
import { Icon as LegacyIcon } from '@ant-design/compatible';
import { Col, List, Row, Spin, Typography, Avatar } from 'antd';
import React from 'react';
import './MemberSearchPage.css';
import FormatLabel from 'components/MemberSearchPage/FormatLabel';
import MemberInterests from 'components/MemberSearchPage/MemberInterests';
import { Link } from 'uikit/Core';
import ROUTES from 'common/routes';
import MemberSearchBioStory from 'components/MemberSearchPage/MemberSearchBioStory';
import ProfilePill from 'uikit/ProfilePill';
import { computeGravatarSrcFromEmail } from 'utils';

const { Text, Title } = Typography;

const Address = ({ item }) => (
  <div className={'flex'} style={{ alignItems: 'center' }}>
    {item.city || item.state || item.country ? (
      <EnvironmentFilled className={'icon-color'} style={{ paddingRight: 8 }} />
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

const iconClassName = ({isPublic, isActive}) => {
  if(!isActive) {
    return {
      icon: 'warning',
      className: 'inactive',
      text: 'Deactivated'
    }
  }
  if(isPublic) {
    return {
      icon: 'eye',
      className: 'public',
      text: 'Public'
    }
  } else {
    return {
      icon: 'eye-invisible',
      className: '',
      text: 'Private'
    }
  }
};

const MemberTable = ({
  currentPage,
  membersPerPage,
  showAll,
  count,
  pending,
  memberList,
  handlePageChange,
  handleShowSizeChange,
  isAdmin,
}) => {
  const firstItem = currentPage * membersPerPage - membersPerPage + 1;
  const lastItem = currentPage * membersPerPage;

  const memberShowThisPage = showAll ? count.total : count.public;

  return (
    <div className={'member-list-container'} style={{ backgroundColor: 'white' }}>
      <List
        itemLayout={'vertical'}
        header={
          pending ? (
            <Spin />
          ) : (
            <Row style={{ marginTop: 12, marginBottom: 12 }}>
              <Col span={12} style={{ textAlign: 'left' }}>
                <Title level={4} style={{ margin: 0 }}>
                  {memberShowThisPage > membersPerPage
                    ? `Showing ${firstItem} - ${Math.min(
                        lastItem,
                        memberShowThisPage,
                      )} of ${memberShowThisPage} ${showAll ? 'members' : 'public members'}`
                    : `Showing ${memberShowThisPage} ${showAll ? '' : 'public'} ${
                        memberShowThisPage < 2 ? 'member' : 'members'
                      } `}
                </Title>
              </Col>
              <Col span={12} style={{ textAlign: 'right' }}>
                <Title
                  level={4}
                  style={{ margin: 0 }}
                >{`${count.total} members total (public & private)`}</Title>
              </Col>
            </Row>
          )
        }
        gutter={20}
        style={{ color: '#343434' }}
        pagination={{
          defaultPageSize: 10,
          showSizeChanger: true,
          pageSizeOptions: ['10', '20', '50'],
          defaultCurrent: 1,
          current: currentPage,
          total: memberShowThisPage,
          pageSize: membersPerPage,
          onChange: handlePageChange,
          onShowSizeChange: handleShowSizeChange,
        }}
        className={'member-list'}
        dataSource={memberList}
        loading={pending}
        renderItem={item => {
          const hasAddress = item.city || item.state || item.country;
          return (
            <List.Item key={item._id} style={{ paddingBottom: 16, paddingTop: 16 }}>
              <Row
                type={'flex'}
                justify="center"
                align="top"
                gutter={32}
                style={{ position: 'relative', margin: 0 }}
              >
                <Col className={'flex'} style={{ width: 130, flexFlow: 'column nowrap' }}>
                  <Avatar
                    src={computeGravatarSrcFromEmail(item.hashedEmail, { d: 'mp' })}
                    size={60}
                  />
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
                          <BankFilled className={'icon-color'} style={{ paddingRight: 8 }} />
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
                {isAdmin ? (
                  <Row
                    style={{
                      position: 'absolute',
                      top: 0,
                      right: 0,
                      display: 'flex',
                      alignItems: 'center',
                    }}
                  >
                    <div className={`icon-color ${iconClassName(item).className}`}>
                      {iconClassName(item).text}
                    </div>
                    <LegacyIcon
                      className={`icon-color ${iconClassName(item).className}`}
                      style={{
                        paddingLeft: 5,
                      }}
                      type={`${iconClassName(item).icon}`}
                      theme="filled"
                    />
                  </Row>
                ) : (
                  ''
                )}
              </Row>
            </List.Item>
          );
        }}
      />
    </div>
  );
};

export default MemberTable;
