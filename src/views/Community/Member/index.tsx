import { useEffect } from 'react';
import { LinkedinFilled, MailFilled } from '@ant-design/icons';
import cx from 'classnames';
import Empty from '@ferlab/ui/core/components/Empty';
import { Col, Divider, List, Result, Row, Skeleton, Space, Typography } from 'antd';
import { useParams } from 'react-router-dom';
import Banner from './components/Banner';
import intl from 'react-intl-universal';
import AvatarHeader from './components/AvatarHeader';

import styles from './index.module.scss';
import ExternalLink from '@ferlab/ui/core/components/ExternalLink';
import { usePersona } from 'store/persona';
import { fetchPersonaUserProfile } from 'store/persona/thunks';
import { useDispatch } from 'react-redux';
import { personaActions } from 'store/persona/slice';

const CommunityMember = () => {
  const dispatch = useDispatch();
  const { id } = useParams<{ id: string }>();
  const { personaUserInfo, isLoading, profile } = usePersona();

  useEffect(() => {
    if (profile === undefined) {
      dispatch(fetchPersonaUserProfile({ id }));
    }

    return () => {
      dispatch(personaActions.clearProfile());
    };
  }, [id, profile, dispatch]);

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
      <div className={styles.communityMember}>
        <Banner isOwnUser={personaUserInfo?._id === profile?._id} />
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
              <Col md={16}>
                <Row gutter={[28, 28]}>
                  <Col span={24}>
                    <Typography.Title level={5}>
                      {intl.get('screen.memberProfile.rolesTitle')}
                    </Typography.Title>
                    <List
                      className={cx(styles.infoList, !profile?.roles?.length && styles.empty)}
                      itemLayout="horizontal"
                      dataSource={profile?.roles ?? []}
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
                  <Col span={24}>
                    <Typography.Title level={5}>
                      {intl.get('screen.memberProfile.usageTitle')}
                    </Typography.Title>
                    {/* <List
                      className={cx(
                        styles.infoList,
                        !result?.portal_usages?.length && styles.empty,
                      )}
                      itemLayout="horizontal"
                      dataSource={result?.portal_usages ?? []}
                      renderItem={(usage, index) => <li key={index}>{usage}</li>}
                      locale={{
                        emptyText: (
                          <Empty
                            showImage={false}
                            description={intl.get('screen.memberProfile.noUsage')}
                            align="left"
                            noPadding
                          />
                        ),
                      }}
                    /> */}
                  </Col>
                </Row>
              </Col>
              <Col md={8}>
                <Space direction="vertical">
                  {profile?.linkedin && (
                    <ExternalLink style={{ color: 'unset' }} href={profile.linkedin}>
                      <Space align="center">
                        <LinkedinFilled />
                        <Typography.Text>Linkedin</Typography.Text>
                      </Space>
                    </ExternalLink>
                  )}
                  {profile?.email && (
                    <Space align="center">
                      <MailFilled />
                      <Typography.Text>{profile?.email}</Typography.Text>
                    </Space>
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
