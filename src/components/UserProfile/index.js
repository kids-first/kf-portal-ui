import * as React from 'react';
import { get } from 'lodash';
import { css } from 'react-emotion';
import {
  compose,
  lifecycle,
  withState,
  withPropsOnChange,
  branch,
  renderComponent,
  withHandlers,
} from 'recompose';
import { Link, withRouter } from 'react-router-dom';
import { injectState } from 'freactal';
import { withTheme } from 'emotion-theming';

import { getProfile, updateProfile } from 'services/profiles';
import { ROLES } from 'common/constants';

import BasicInfoForm from 'components/forms/BasicInfoForm';
import { Container, EditButton, ProfileImage } from './ui';
import AboutMe from './AboutMe';
import Settings from './Settings';
import RoleIconButton from '../RoleIconButton';
import Row from 'uikit/Row';
import { H1 } from 'uikit/Headings';
import { KEY_PUBLIC_PROFILE_INVITE_IS_SEEN } from 'common/constants';
import { Alert } from 'antd';
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

const showPublicProfileInvite = (profile = {}) => {
  return (
    !Boolean(profile.isPublic) && !Boolean(localStorage.getItem(KEY_PUBLIC_PROFILE_INVITE_IS_SEEN))
  );
};

export default compose(
  injectState,
  withRouter,
  withState('profile', 'setProfile', {}),
  withTheme,
  lifecycle({
    async componentDidMount() {
      const {
        state: { loggedInUser },
        match: {
          params: { egoId },
        },
        setProfile,
        api,
      } = this.props;
      loggedInUser && egoId === loggedInUser.egoId
        ? setProfile(loggedInUser)
        : setProfile(await getProfile(api)());
    },
  }),
  withState('interests', 'setInterests', ({ profile }) => profile.interests || []),
  withPropsOnChange(['profile'], ({ profile, state: { loggedInUser } }) => {
    return {
      canEdit: loggedInUser && profile.egoId === loggedInUser.egoId,
    };
  }),
  withPropsOnChange(
    ['match'],
    async ({
      match: {
        params: { egoId },
      },
      setProfile,
      state: { loggedInUser },
      api,
    }) => ({
      notUsed:
        loggedInUser && egoId === loggedInUser.egoId
          ? setProfile(loggedInUser)
          : setProfile(await getProfile(api)()),
    }),
  ),
  withHandlers({
    submit: ({ profile, effects: { setUser }, api }) => async values => {
      await updateProfile(api)({
        user: {
          ...profile,
          ...values,
        },
      }).then(async updatedProfile => {
        await setUser({ ...updatedProfile, api });
      });
    },
    onCloseAlert: () => () => localStorage.setItem(KEY_PUBLIC_PROFILE_INVITE_IS_SEEN, true),
  }),
  branch(
    ({ profile }) => !profile || profile.length === 0,
    renderComponent(({ match: { params: { egoId } } }) => <div>No user found with id {egoId}</div>),
  ),
)(
  ({
    state: { loggedInUser },
    effects: { setModal },
    profile,
    theme,
    canEdit,
    submit,
    location: { hash },
    api,
    onCloseAlert,
  }) => (
    <div
      className={css`
        flex: 1;
      `}
    >
      {hash !== '#settings' && showPublicProfileInvite(profile) && (
        <Alert
          message="Make your profile public"
          description="You can make your profile public by changing your account settings"
          type="info"
          banner
          closable
          onClose={onCloseAlert}
        />
      )}
      <div
        className={css`
          ${userProfileBackground(profile)};
          min-height: 330px;
          align-items: center;
          display: flex;
          justify-content: center;
        `}
      >
        <Container row alignItems="center">
          <Row width="65%" pr={50} alignItems="center">
            <ProfileImage email={profile.email || ''} />
            <div
              className={css`
                width: 49%;
                align-items: flex-start;
                ${theme.column};
                padding: 0 15px;
              `}
            >
              <RoleIconButton loggedInUser={loggedInUser} />

              <H1 lineHeight="31px" mb="10px" mt="16px" color={theme.white}>
                {`${profile.firstName} ${profile.lastName}`}
              </H1>

              <div
                className={css`
                  font-size: 14px;
                  color: #fff;
                  line-height: 28px;
                  ${theme.column};
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
                <span>
                  {[profile.city, profile.state, profile.country].filter(Boolean).join(', ')}
                </span>
                <span
                  css={`
                    margin-top: 5px;
                  `}
                >
                  <EditButton
                    onClick={() => {
                      setModal({
                        title: 'Edit Basic Information',
                        component: <BasicInfoForm {...{ api }} />,
                      });
                    }}
                  />
                </span>
              </div>
            </div>
          </Row>
        </Container>
      </div>
      <div
        className={css`
          display: flex;
          justify-content: center;
          align-items: flex-start;
          background: #fff;
          box-shadow: 0px 0px 4.9px 0.1px #bbbbbb;
          border: solid 1px #e0e1e6;
        `}
      >
        <Container>
          <ul className={theme.secondaryNav}>
            <li>
              <Link
                to="#aboutMe"
                className={hash === '#aboutMe' || hash !== '#settings' ? 'active' : ''}
              >
                About Me
              </Link>
            </li>
            {canEdit && (
              <li>
                <Link to="#settings" className={hash === '#settings' ? 'active' : ''}>
                  Settings
                </Link>
              </li>
            )}
          </ul>
        </Container>
      </div>
      {(hash === '#aboutMe' || hash !== '#settings') && (
        <AboutMe profile={profile} canEdit={canEdit} submit={submit} />
      )}
      {hash === '#settings' && <Settings profile={profile} submit={submit} />}
    </div>
  ),
);
