import React from 'react';
import { InfoCircleOutlined, EditTwoTone } from '@ant-design/icons';
import { Avatar, Button, Popconfirm, Row, Switch, Tooltip, Typography } from 'antd';
import { userProfileBackground } from './utils';
import PropTypes from 'prop-types';
import { computeGravatarSrcFromEmail } from 'utils';
import ProfilePill from 'uikit/ProfilePill';
import './style.css';

const { Title, Text } = Typography;

const HeaderBanner = ({
  profile,
  onChangePrivacyStatusCb,
  onChangeActivityStatusCb,
  isLoading,
  canEdit,
  isAdmin,
}) => (
  <Row
    align={'middle'}
    type={'flex'}
    justify={'space-between'}
    style={userProfileBackground(profile)}
    className={`hd-main-row`}
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
            icon={<EditTwoTone />}
            shape={'circle'}
            href="https://en.gravatar.com/site/login"
            target="_blank"
            style={canEdit ? null : { visibility: 'hidden' }} /** avoids breaking dimensions */
          />
        </div>
        <Title level={2} style={{ color: 'white' }} strong>
          {`${profile.firstName} ${profile.lastName}`}
        </Title>
        {isAdmin ? (
          <Popconfirm
            placement="leftTop"
            title={'You will Activate/Deactivate member. Are you sure?'}
            onConfirm={onChangeActivityStatusCb}
          >
            <Switch
              loading={isLoading}
              className={profile.isActive ? 'hd-switch-bg-is-active' : 'hd-switch-bg-is-not-active'}
              checkedChildren={'Active'}
              unCheckedChildren="Inactive"
              defaultChecked
              checked={profile.isActive}
              style={{ position: 'absolute', top: 20, right: 20 }}
            />
          </Popconfirm>
        ) : (
          ''
        )}
      </div>
    </div>
    {canEdit && (
      <div className={'hd-switch-wrapper'}>
        <Row type={'flex'} justify={'start'} align={'middle'} className={'hd-profile-status-row'}>
          <Text className={'hd-profile-status'}>Profile Status</Text>
          <span className={'hd-tooltip-wrapper'}>
            <Tooltip
              placement="topLeft"
              title="When your profile is public, other members can see information about you that includes your bio, story, research interests and contact information."
            >
              <InfoCircleOutlined style={{ color: 'white' }} />
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
      </div>
    )}
  </Row>
);

HeaderBanner.propTypes = {
  profile: PropTypes.object.isRequired,
  onChangePrivacyStatusCb: PropTypes.func.isRequired,
  isLoading: PropTypes.bool.isRequired,
  canEdit: PropTypes.bool.isRequired,
  onChangeActivityStatusCb: PropTypes.func,
  isAdmin: PropTypes.bool,
};

export default HeaderBanner;
