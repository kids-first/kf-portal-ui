import React from 'react';
import { Alert, Avatar, Col, Icon, Row, Switch, Typography, Tooltip, Button } from 'antd';
import { userProfileBackground } from './utils';
import PropTypes from 'prop-types';
import { computeGravatarSrcFromEmail } from 'utils';
import ProfilePill from './ProfilePill';
import { isFeatureEnabled } from 'common/featuresToggles';
import './style.css';

const { Title, Text } = Typography;

const HeaderBanner = ({ profile, onChangePrivacyStatusCb, isLoading, error, canEdit }) => {
  return (
    <Row
      align={'middle'}
      type={'flex'}
      justify={'center'}
      className={`${userProfileBackground(profile)}  hd-main-row`}
    >
      <Col span={5} offset={2} pull={canEdit ? 0 : 8}>
        <Row>
          <Col span={12} offset={12}>
            <ProfilePill roles={profile.roles} />
          </Col>
        </Row>
        <Row type={'flex'} align={'middle'}>
          <Col span={6} offset={6}>
            <div className={'hd-user-info-wrapper'}>
              <Avatar
                src={computeGravatarSrcFromEmail(profile.email, { size: 80, d: 'mp' })}
                size={80}
              />
              {canEdit && (
                <Button
                  type={'primary'}
                  className={'hd-edit-button'}
                  size="small"
                  icon={'edit'}
                  shape={'circle'}
                  href="https://en.gravatar.com/site/login"
                  target="_blank"
                />
              )}
            </div>
          </Col>
          <Col span={12}>
            <Title
              level={1}
              style={{ color: 'white' }}
            >{`${profile.firstName} ${profile.lastName}`}</Title>
          </Col>
        </Row>
      </Col>
      {canEdit &&
      isFeatureEnabled('searchMembers') && ( // isFeatureEnabled remove me one day :)
          <Col span={4} offset={12} pull={1}>
            <Row type={'flex'} justify={'center'}>
              <Col span={8} offset={12}>
                <Text className={'hd-text'}>Profile Status</Text>
              </Col>
              <Col span={4}>
                <span>
                  <Tooltip
                    placement="topLeft"
                    title="When your profile is public, other members can see it. Otherwise, only you can see it."
                  >
                    <Icon type="info-circle" style={{ color: 'white' }} />
                  </Tooltip>
                </span>
              </Col>
            </Row>
            <Row type={'flex'} justify={'center'}>
              <Col span={5} offset={10}>
                <Text className={'hd-text'}>Private</Text>
              </Col>
              <Col span={4}>
                <Switch
                  loading={isLoading}
                  className={profile.isPublic ? 'hd-switch-bg-is-public' : 'hd-switch-bg-is-not-public'}
                  defaultChecked
                  onChange={onChangePrivacyStatusCb}
                  checked={profile.isPublic}
                />
              </Col>
              <Col span={5}>
                <Text className={'hd-text'}>Public</Text>
              </Col>
            </Row>
            {error && (
              <Row>
                <Col span={18} offset={6}>
                  <Alert
                    message="Error"
                    description="An error occurred while updating the profile"
                    type="error"
                    closable
                  />
                </Col>
              </Row>
            )}
          </Col>
        )}
    </Row>
  );
};

HeaderBanner.propTypes = {
  profile: PropTypes.object.isRequired,
  onChangePrivacyStatusCb: PropTypes.func.isRequired,
  isLoading: PropTypes.bool.isRequired,
  error: PropTypes.object,
  canEdit: PropTypes.bool.isRequired,
};

export default HeaderBanner;
