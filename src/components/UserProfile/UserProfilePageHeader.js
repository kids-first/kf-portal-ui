import React from 'react';
import { css } from 'emotion';
import { Col, PageHeader } from 'antd';
import Row from 'uikit/Row';
import { get } from 'lodash';
import { ROLES } from 'common/constants';

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

const UserProfilePageHeader = ({ profile, loggedInUser, api, onSummitUpdateProfile, canEdit }) => {
  return (
    <div
      className={css`
        ${userProfileBackground(profile)};
      `}
      style={{minHeight:330, alignItems:'center', display:'flex', justifyContent:"center"}}
    >
      <Row>
        <Col span={12}>col-12</Col>
        <Col span={12}>col-12</Col>
      </Row>
      <Row>
        <Col span={12}>col-12</Col>
        <Col span={12}>col-12</Col>
      </Row>

      {/*<Container row alignItems="center">*/}
      {/*  <Row width="65%" pr={50} alignItems="center">*/}
      {/*    <ProfileImage email={profile.email || ''} />*/}
      {/*    <div*/}
      {/*      className={css`*/}
      {/*        width: 49%;*/}
      {/*        align-items: flex-start;*/}
      {/*        padding: 0 15px;*/}
      {/*      `}*/}
      {/*    >*/}
      {/*      <RoleIconButton loggedInUser={loggedInUser} />*/}

      {/*      <H1 lineHeight="31px" mb="10px" mt="16px">*/}
      {/*        {`${profile.firstName} ${profile.lastName}`}*/}
      {/*      </H1>*/}

      {/*      <div*/}
      {/*        className={css`*/}
      {/*          font-size: 14px;*/}
      {/*          color: #fff;*/}
      {/*          line-height: 28px;*/}
      {/*        `}*/}
      {/*      >*/}
      {/*        <span*/}
      {/*          className={css`*/}
      {/*            font-size: 1.4em;*/}
      {/*          `}*/}
      {/*        >*/}
      {/*          {profile.jobTitle}*/}
      {/*        </span>*/}
      {/*        <span>{profile.institution}</span>*/}
      {/*        <span>{profile.department}</span>*/}
      {/*        <span>*/}
      {/*          {[profile.city, profile.state, profile.country].filter(Boolean).join(', ')}*/}
      {/*        </span>*/}
      {/*        <span*/}
      {/*          css={`*/}
      {/*            margin-top: 5px;*/}
      {/*          `}*/}
      {/*        >*/}
      {/*          <EditButton*/}
      {/*            onClick={() => {*/}
      {/*              // setModal({*/}
      {/*              //   title: 'Edit Basic Information',*/}
      {/*              //   component: <BasicInfoForm {...{ api }} />,*/}
      {/*              // });*/}
      {/*            }}*/}
      {/*          />*/}
      {/*        </span>*/}
      {/*      </div>*/}
      {/*    </div>*/}
      {/*  </Row>*/}
      {/*</Container>*/}
    </div>
  );
};

UserProfilePageHeader.propTypes = {
  // profile: PropTypes.object.isRequired,
  // onSummitUpdateProfile: PropTypes.func.isRequired,
  // canEdit: PropTypes.bool.isRequired,
};

export default UserProfilePageHeader;
