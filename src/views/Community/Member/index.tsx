import { GlobalOutlined, LinkedinFilled } from '@ant-design/icons';
import cx from 'classnames';
import Empty from '@ferlab/ui/core/components/Empty';
import { Alert, Button, Col, Divider, List, Result, Row, Skeleton, Space, Typography } from 'antd';
import { Link, useParams } from 'react-router-dom';
import Banner from './components/Banner';
import intl from 'react-intl-universal';
import AvatarHeader from './components/AvatarHeader';

import styles from './index.module.scss';
import { usePersona } from 'store/persona';
import { areaOfInterestOptions, memberRolesOptions } from '../contants';
import { useMemberProfile } from 'graphql/members/actions';

const CommunityMember = () => {
  const { id } = useParams<{ id: string }>();
  const { personaUserInfo, isLoading: personaLoading } = usePersona();
  const { loading: profileLoading, profile } = useMemberProfile(id);
  const isOwner = personaUserInfo?._id === id;

  const memberRole =
    profile?.roles?.map(
      (role: string) => memberRolesOptions.find((memberRole) => memberRole.key === role)?.value,
    ) || [];

  if (!profileLoading && !profile && !personaLoading) {
    return (
      <Result
        className={styles.notFoundMember}
        status="404"
        title="404"
        subTitle={intl.get('screen.memberProfile.notFound')}
      />
    );
  }

  return (
    <div className={styles.communityMemberWrapper}>
      {isOwner &&
        !profile?.isPublic &&
        !window.sessionStorage.getItem('profileSettings.privateAlertHasBeenClosed') && (
          <Alert
            className={styles.privateAlert}
            type="warning"
            message={
              <>
                {intl.get('screen.memberProfile.privateAlert')}
                <Link to={`/profile/settings`}>
                  {intl.get('screen.memberProfile.settingsPage')}
                </Link>
                .
              </>
            }
            closable
            onClose={() => {
              window.sessionStorage.setItem('profileSettings.privateAlertHasBeenClosed', 'true');
            }}
          />
        )}
      <div className={styles.communityMember}>
        <Banner isOwnUser={isOwner} />
        <div className={styles.contentWrapper}>
          <AvatarHeader user={profile} isLoading={profileLoading} />
          <Divider className={styles.divider} />
          {profileLoading ? (
            <Skeleton
              paragraph={{
                rows: 5,
              }}
            />
          ) : (
            <Row gutter={[80, 28]}>
              <Col md={18}>
                <Row gutter={[28, 28]}>
                  <Col span={24}>
                    <Typography.Title level={4}>
                      {intl.get('screen.memberProfile.rolesTitle')}
                    </Typography.Title>
                    <List
                      className={cx(styles.infoList, !profile?.roles?.length && styles.empty)}
                      itemLayout="horizontal"
                      dataSource={memberRole}
                      renderItem={(role, index) => <li key={index}>{role}</li>}
                      locale={{
                        emptyText: (
                          <Empty
                            showImage={false}
                            description={intl.get('screen.memberProfile.noRoles')}
                            align="left"
                            noPadding
                          />
                        ),
                      }}
                    />
                  </Col>
                  {profile?.interests?.length! > 0 && (
                    <Col span={24}>
                      <Typography.Title level={5}>
                        {intl.get('screen.memberProfile.interests')}
                      </Typography.Title>
                      <List
                        className={cx(styles.infoList, !profile?.interests?.length && styles.empty)}
                        itemLayout="horizontal"
                        dataSource={profile?.interests}
                        renderItem={(interest, index) => (
                          <li key={index}>
                            {areaOfInterestOptions.find(
                              (e) => e.toLocaleLowerCase() === interest,
                            ) || interest}
                          </li>
                        )}
                        locale={{
                          emptyText: (
                            <Empty
                              showImage={false}
                              description={intl.get('screen.memberProfile.noStudiesInterest')}
                              align="left"
                              noPadding
                            />
                          ),
                        }}
                      />
                    </Col>
                  )}
                </Row>
              </Col>
              <Col md={6}>
                <Space className={styles.linksContainer} direction="vertical">
                  {profile?.linkedin && (
                    <Button
                      className={styles.link}
                      href={profile.linkedin}
                      type="link"
                      target="_blank"
                      icon={<LinkedinFilled />}
                    >
                      Linkedin
                    </Button>
                  )}

                  {profile?.website && (
                    <Button
                      className={styles.link}
                      href={profile.website}
                      type="link"
                      target="_blank"
                      icon={<GlobalOutlined />}
                    >
                      Website
                    </Button>
                  )}
                </Space>
              </Col>
            </Row>
          )}
        </div>
      </div>
    </div>
  );
};

export default CommunityMember;
