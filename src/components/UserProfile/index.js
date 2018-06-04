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
import styled from 'react-emotion';
import PencilIcon from 'react-icons/lib/fa/pencil';

import { withTheme } from 'emotion-theming';
import { updateProfile } from 'services/profiles';
import { ROLES } from 'common/constants';
import { getProfile } from 'services/profiles';
import BasicInfoForm from 'components/forms/BasicInfoForm';

import CompleteOMeter from 'components/CompleteOMeter';

import Gravtar from 'uikit/Gravatar';

import AboutMe from './AboutMe';
import Settings from './Settings';
import CompletionWrapper from './CompletionWrapper';
import RoleIconButton from '../RoleIconButton';

export const Container = styled('div')`
  justify-content: space-around;
  align-items: center;
  height: 100%;
  width: 76%;
`;

export const EditButton = compose(withTheme)(({ theme, ...props }) => (
  <button css={theme.hollowButton} {...props}>
    <PencilIcon className={'icon'} /> Edit
  </button>
));

export const H2 = styled('h2')`
  ${props => props.theme.profileH2};
`;

export const H3 = styled('h3')`
  ${props => props.theme.h3};
  margin-top: 0px;
  font-size: 22px;
  font-weight: 300;
  line-height: 1.27;
  letter-spacing: 0.3px;
  border-bottom: 1px solid #d4d6dd;
  display: flex;
  justify-content: space-between;
  padding-bottom: 10px;
  
`;

// export const H4 = styled('h4')`
//   font-family: ${({ theme }) => theme.fonts.details};
//   font-size: 13px;
//   font-style: italic;
//   line-height: 1.85;
//   text-align: left;
//   color: #74757d;
//   margin: 0;
//   font-weight: normal;
// `;

export const H4 = styled('h4')`
  ${({ theme }) => theme.h4}
  color: ${({ theme }) => theme.greyScale1};
  font-weight: 700;
  ${({ theme }) => theme.spacing.collapse};
`;

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
      <Container className={theme.row}>
        <Gravtar
          email={profile.email || ''}
          size={173}
          className={css`
            border-radius: 50%;
            border: 5px solid #fff;
          `}
        />
        <div
          className={css`
            width: 49%;
            align-items: flex-start;
            ${theme.column};
            padding: 0 15px;
          `}
        >
          <RoleIconButton />

          <h2
            css={`
              ${theme.h2} 
              color: ${theme.white};
              font-weight: 700;
              margin-bottom: 0;
            `}
          >{`${profile.firstName} ${profile.lastName}`}</h2>
          <h2
              css={`
                ${theme.spacing.collapse}
                ${theme.h2}
                color: ${theme.white};
                ${theme.spacing.collapse}
              `}
            >
              <small css={`${theme.text.small}`}> {profile.jobTitle} </small>
            </h2>
          <div
            css={`
              ${theme.paragraph}
              line-height: 28px;
              color: #fff;
              ${theme.column};
            `}
          >
            <p css={`${theme.paragraph} color: ${theme.white}; margin-top:0;`}>
              {profile.institution} <br />
              {[profile.city, profile.state, profile.country].filter(Boolean).join(', ')}<br />
              <span css={`${theme.text.underline}`} >{profile.email}</span>  
            </p>
            
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
        <div
          css={`
            width: 310px;
            ${theme.column};
            align-items: center;
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
