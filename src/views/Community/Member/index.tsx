import { useEffect } from 'react';
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
import { fetchPersonaUserProfile } from 'store/persona/thunks';
import { useDispatch } from 'react-redux';
import { personaActions } from 'store/persona/slice';
import { memberRolesOptions, diseasesInterestOptions, studiesInterestOptions } from '../contants';

const CommunityMember = () => {
  const dispatch = useDispatch();
  const { id } = useParams<{ id: string }>();
  const { personaUserInfo, isLoading, profile } = usePersona();
  const isOwner = personaUserInfo?._id === id;

  const diseasesInterest = personaUserInfo?.interests?.filter((interest) =>
    diseasesInterestOptions.some(
      (diseasesInterest) => diseasesInterest.value.toLocaleLowerCase() === interest,
    ),
  );

  const studiesInterest = personaUserInfo?.interests?.filter((interest) =>
    studiesInterestOptions.some(
      (studiesInterest) => studiesInterest.value.toLocaleLowerCase() === interest,
    ),
  );

  const memberRole =
    personaUserInfo?.roles?.map(
      (role) => memberRolesOptions.find((memberRole) => memberRole.key === role)?.value,
    ) || [];

  useEffect(() => {
    if (profile !== undefined) {
      return;
    }

    if (isOwner) {
      dispatch(personaActions.setUserAsMember(personaUserInfo));
    } else {
      dispatch(fetchPersonaUserProfile({ id }));
    }

    return () => {
      dispatch(personaActions.clearProfile());
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (!isLoading && !profile) {
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
        !personaUserInfo.isPublic &&
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
          <AvatarHeader user={profile} isLoading={isLoading} />
          <Divider className={styles.divider} />
          {isLoading ? (
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
                  {(diseasesInterest?.length! > 0 || studiesInterest?.length! > 0) && (
                    <>
                      <Col span={24}>
                        <Typography.Title level={4}>
                          {intl.get('screen.memberProfile.researchInterest')}
                        </Typography.Title>

                        {diseasesInterest?.length! > 0 && (
                          <>
                            <Typography.Title level={5}>
                              {intl.get('screen.memberProfile.diseasesInterest')}
                            </Typography.Title>
                            {diseasesInterest?.join(', ')}
                          </>
                        )}
                      </Col>

                      {studiesInterest?.length! > 0 && (
                        <Col span={24}>
                          <Typography.Title level={5}>
                            {intl.get('screen.memberProfile.studiesInterest')}
                          </Typography.Title>
                          <List
                            className={cx(
                              styles.infoList,
                              !studiesInterest?.length && styles.empty,
                            )}
                            itemLayout="horizontal"
                            dataSource={studiesInterest}
                            renderItem={(interest, index) => <li key={index}>{interest}</li>}
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
                    </>
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
