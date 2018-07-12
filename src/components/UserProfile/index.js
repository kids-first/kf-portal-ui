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
import CompleteOMeter from 'components/CompleteOMeter';
import { Container, EditButton } from './ui';
import AboutMe from './AboutMe';
import Settings from './Settings';
import CompletionWrapper from './CompletionWrapper';

import ProfileInfoCard from 'uikit/ProfileInfoCard';
import { P, SmallText } from 'uikit/Typography';

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

export default compose(
  injectState,
  withRouter,
  withState('profile', 'setProfile', {}),
  withTheme,
  lifecycle({
    async componentDidMount(): void {
      const { state: { loggedInUser }, match: { params: { egoId } }, setProfile, api } = this.props;
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
    async ({ match: { params: { egoId } }, setProfile, state: { loggedInUser }, api }) => ({
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
  }),
  branch(
    ({ profile }) => !profile || profile.length === 0,
    renderComponent(({ match: { params: { egoId } } }) => <div>No user found with id {egoId}</div>),
  ),
)(({ state, effects: { setModal }, profile, theme, canEdit, submit, location: { hash }, api }) => (
  <div
    className={css`
      flex: 1;
    `}
  >
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
        <ProfileInfoCard
          orientation="horizontal"
          profile={profile}
          gravatar={{ size: 180 }}
          theme={theme}
          buttons={() => (
            <EditButton
              onClick={() => {
                setModal({
                  title: 'Edit Basic Information',
                  component: <BasicInfoForm {...{ api }} />,
                });
              }}
            />
          )}
        />

        <div
          css={`
            width: 53%;
            ${theme.column};
            align-items: center;
          `}
        >
          <CompletionWrapper
            completed={state.percentageFilled}
            css={`
              width: 130px;
              margin: 0 auto;
            `}
          >
            <CompleteOMeter percentage={state.percentageFilled} />
          </CompletionWrapper>

          <div>
            <P center italic color="white" mt="20px" mb="0" px="15%">
              <SmallText>
                Complete your profile for a more personalized experience and to help encourage
                collaboration!
              </SmallText>
            </P>
          </div>
        </div>
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
));
