import React from 'react';
import { Alert, Avatar, Icon, Row, Switch, Typography, Tooltip, Button } from 'antd';
import { userProfileBackground } from './utils';
import PropTypes from 'prop-types';
import { computeGravatarSrcFromEmail } from 'utils';
import ProfilePill from 'uikit/ProfilePill';
import { isFeatureEnabled } from 'common/featuresToggles';
import './style.css';

const { Title, Text } = Typography;

const HeaderBanner = ({ profile, onChangePrivacyStatusCb, isLoading, error, canEdit }) => {
  return (
      <Row
          align={'middle'}
          type={'flex'}
          justify={'space-between'}
          className={`${userProfileBackground(profile)} hd-main-row`}
      >
        <div className={'hd-user-info-wrapper'}>
          <div className={'hd-profile-wrapper'}>
            <ProfilePill roles={profile.roles} />
          </div>
          <div className={'hd-user-info-group'}>
            <div className={'hd-user-avatar-wrapper'}>
              <Avatar
                  src={computeGravatarSrcFromEmail(profile.hashedEmail, { size: 90, d: 'mp' })}
                  size={90}
              />
              <Button
                  type={'primary'}
                  className={'hd-edit-button'}
                  icon={'edit'}
                  shape={'circle'}
                  href="https://en.gravatar.com/site/login"
                  target="_blank"
                  style={canEdit ? null : { visibility: 'hidden' }} /** avoids breaking dimensions */
              />
            </div>
            <Title level={2} style={{ color: 'white' }} strong>
              {`${profile.firstName} ${profile.lastName}`}
            </Title>
          </div>
        </div>
        {canEdit &&
        isFeatureEnabled('searchMembers') && ( //remove me one day :)
            <div className={'hd-switch-wrapper'}>
              <Row
                  type={'flex'}
                  justify={'start'}
                  align={'middle'}
                  className={'hd-profile-status-row'}
              >
                <Text className={'hd-profile-status'}>Profile Status</Text>
                <span className={'hd-tooltip-wrapper'}>
                <Tooltip
                    placement="topLeft"
                    title="When your profile is public, other members can see various information about you such as your bio, story, interests, contact information, ..."
                >
                  <Icon type="info-circle" style={{ color: 'white' }} />
                </Tooltip>
              </span>
              </Row>
              <Row type={'flex'} justify={'space-around'} align={'middle'}>
                <Text className={'hd-text'}>Private</Text>
                <Switch
                    loading={isLoading}
                    className={`${
                        profile.isPublic ? 'hd-switch-bg-is-public' : 'hd-switch-bg-is-not-public'
                    } hd-switch`}
                    defaultChecked
                    onChange={onChangePrivacyStatusCb}
                    checked={profile.isPublic}
                />
                <Text className={'hd-text'}>Public</Text>
              </Row>
              {Boolean(error) && Object.keys(error).length > 0 && (
                  <Row>
                    <Alert
                        message="Error"
                        description="An error occurred while updating the profile"
                        type="error"
                        closable
                    />
                  </Row>
              )}
            </div>
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
