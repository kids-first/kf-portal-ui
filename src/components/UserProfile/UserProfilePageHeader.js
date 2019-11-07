import React from 'react';
import { css } from 'emotion';
import { Col, Typography } from 'antd';
import Row from 'uikit/Row';
import { EditButton, ProfileImage } from 'components/UserProfile/ui';
import RoleIconButton from 'components/RoleIconButton';
import { withTheme } from 'emotion-theming';
import { userProfileBackground } from './utils';
import PropTypes from 'prop-types';

const { Title } = Typography;

const UserProfilePageHeader = ({ profile, theme }) => {
  return (
    <div
      className={userProfileBackground(profile)}
      style={{ align: 'center', justify: 'space-around', height: '100%' }}
    >
      <Row align="center" justify="space-around" style={{ height: '100%' }}>
        <Col span={6}>
          <ProfileImage email={profile.email || ''} d={'mp'} />
        </Col>
        <Col
          span={6}
          className={css`
            align-items: flex-start;
            ${theme.column};
            padding: 0 15px;
          `}
        >
          <RoleIconButton profile={profile} />
          <Title
            style={{
              fontSize: 28,
              margin: 0,
              padding: 0,
              fontWeight: 500,
              lineHeight: 0.71,
              letterSpacing: 0.4,
              fontFamily: `${theme.fonts.default}`,
              textDecoration: 'none',
            }}
            mb="10px"
            mt="16px"
          >
            {`${profile.firstName} ${profile.lastName}`}
          </Title>
          <div
            className={css`
              font-size: 14px;
              color: #fff;
              line-height: 28px;
            `}
          >
            <span
              className={css`
                font-size: 1.4em;
              `}
            >
              {profile.jobTitle}
            </span>
            <span>{profile.institution}</span>
            <span>{profile.department}</span>
            <span>{[profile.city, profile.state, profile.country].filter(Boolean).join(', ')}</span>
            <span
              css={`
                margin-top: 5px;
              `}
            >
              <EditButton
                onClick={() => {
                  // setModal({
                  //   title: 'Edit Basic Information',
                  //   component: <BasicInfoForm {...{ api }} />,
                  // });
                }}
              />
            </span>
          </div>
        </Col>
        <Col span={12}> </Col>
      </Row>
    </div>
  );
};

UserProfilePageHeader.propTypes = {
  profile: PropTypes.object.isRequired,
  theme: PropTypes.object.isRequired,
};
const UserProfilePageHeaderWithTheme = withTheme(UserProfilePageHeader);

export default UserProfilePageHeaderWithTheme;
