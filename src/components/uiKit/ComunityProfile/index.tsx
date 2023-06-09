import intl from 'react-intl-universal';
import { Link } from 'react-router-dom';
import { GlobalOutlined, LinkedinFilled } from '@ant-design/icons';
import Empty from '@ferlab/ui/core/components/Empty';
import { Alert, Button, Col, Divider, List, Row, Skeleton, Space, Typography } from 'antd';
import cx from 'classnames';
import { IMemberEntity } from 'graphql/members/models';
import { areaOfInterestOptions, memberRolesOptions } from 'views/Community/contants';

import { IPersonaUser } from 'services/api/persona/models';

import AvatarHeader from './components/AvatarHeader';
import Banner from './components/Banner';

import styles from './index.module.scss';

type ownProps = {
  profile?: IMemberEntity | IPersonaUser;
  isOwner: boolean;
  loading: boolean;
};

const CommunityProfile = ({ profile, isOwner, loading }: ownProps) => {
  const memberRole =
    profile?.roles?.map(
      (role: string) => memberRolesOptions.find((memberRole) => memberRole.key === role)?.value,
    ) || [];

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
          <AvatarHeader user={profile} isLoading={loading} />
          <Divider className={styles.divider} />
          {loading ? (
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

export default CommunityProfile;
