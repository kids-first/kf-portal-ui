import * as React from 'react';
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
import { updateProfile } from 'services/profiles';
import { getProfile } from 'services/profiles';
import BasicInfoForm from 'components/forms/BasicInfoForm';

import CompleteOMeter from 'components/CompleteOMeter';

import AboutMe from './AboutMe';
import Settings from './Settings';
import CompletionWrapper from './CompletionWrapper';
import ProfileInfoCard from '../../uikit/ProfileInfoCard';
import { Container, EditButton, userProfileBackground } from './styles';

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
      <Container className={theme.row}>
        <div
          className={css`
            width: 61%;
          `}
        >
          <ProfileInfoCard
            orientation={'horizontal'}
            {...{ profile }}
            gravatar={{ size: 173 }}
            buttons={() => (
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
            )}
          />
        </div>

        <div
          css={`
            width: 310px;
            ${theme.column};
            align-items: center;
            margin-right: 47px;
          `}
        >
          <CompletionWrapper
            completed={state.percentageFilled}
            css={`
              width: 130px;
            `}
          >
            <CompleteOMeter percentage={state.percentageFilled} />
          </CompletionWrapper>

          <div
            css={`
              font-family: ${theme.fonts.details};
              font-size: 13px;
              font-style: italic;
              line-height: 1.69;
              color: #ffffff;
              padding-top: 21px;
            `}
          >
            Complete your profile for a more personalized<br />
            experience and to help encourage collaboration!
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
        box-shadow: 0px 0prx 4.9px 0.1px #bbbbbb;
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
