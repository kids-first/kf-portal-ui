import React from 'react';
import { css } from 'emotion';
import { Col, Typography } from 'antd';
import Row from 'uikit/Row';
import { get } from 'lodash';
import { ROLES } from 'common/constants';
import { EditButton, ProfileImage } from 'components/UserProfile/ui';
import RoleIconButton from 'components/RoleIconButton';
import { withTheme } from 'emotion-theming';

const { Title } = Typography;

export const userProfileBackground = (
  loggedInUser,
  { showBanner = true, gradientDirection = 'right' } = {},
) => {
  const role = ROLES.find(x => x.type === get(loggedInUser, 'roles[0]', '')) || {};
  const banner = get(role, 'banner', '');
  const profileColors = get(role, 'profileColors', {});
  return css`
    background-position-x: right;
    background-repeat: no-repeat;
    background-image: ${showBanner ? `url(${banner}), ` : ``}
      linear-gradient(
        to ${gradientDirection},
        ${profileColors.gradientDark} 33%,
        ${profileColors.gradientMid} 66%,
        ${profileColors.gradientLight}
      );
  `;
};

const UserProfilePageHeader = ({
  profile,
  loggedInUser,
  theme,
}) => {
  return (
    <div
      className={css`
        ${userProfileBackground(profile)};
      `}
      style={{ align: 'center', justify:"space-around", height: '100%'}}
    >
      <Row align="center" justify="space-around" style={{ height: '100%' }} >
        <Col span={6}>
          <ProfileImage email={profile.email || ''} d={'mp'} />
        </Col>
        <Col span={6} className={css`
                align-items: flex-start;
                ${theme.column};
                padding: 0 15px;
              `}>
          <RoleIconButton loggedInUser={loggedInUser} />
          <Title
            style={{
              fontSize: 28,
              // color: ${props.color ? props.color : theme.secondary},
              margin: 0,
              padding: 0,
              fontWeight: 500,
              lineHeight: 0.71,
              letterSpacing: 0.4,
              fontFamily: `${theme.fonts.default}`,
              textDecoration: 'none',
            }}
            lineHeigh="31px"
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
  // profile: PropTypes.object.isRequired,
  // onSummitUpdateProfile: PropTypes.func.isRequired,
  // canEdit: PropTypes.bool.isRequired,
};
const UserProfilePageHeaderWithTheme = withTheme(UserProfilePageHeader);

export default UserProfilePageHeaderWithTheme;
