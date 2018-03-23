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

export const Container = styled('div')`
  justify-content: space-around;
  align-items: center;
  height: 100%;
  width: 76%;
`;

export const EditButton = compose(withTheme)(({ theme, ...props }) => (
  <button css={theme.hollowButton} {...props}>
    <PencilIcon /> Edit
  </button>
));

export const H2 = styled('h2')`
  ${props => props.theme.profileH2};
`;

export const H3 = styled('h3')`
  ${props => props.theme.profileH3};
`;

export const H4 = styled('h4')`
  font-family: 'Open Sans';
  font-size: 13px;
  font-style: italic;
  line-height: 1.85;
  text-align: left;
  color: #74757d;
  margin: 0;
  font-weight: normal;
`;

export default compose(
  injectState,
  withRouter,
  withState('profile', 'setProfile', {}),
  withTheme,
  lifecycle({
    async componentDidMount(): void {
      const { state: { loggedInUser }, match: { params: { egoId } }, setProfile } = this.props;
      loggedInUser && egoId === loggedInUser.egoId
        ? setProfile(loggedInUser)
        : setProfile(await getProfile({ egoId }));
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
    async ({ match: { params: { egoId } }, setProfile, state: { loggedInUser } }) => ({
      notUsed:
        loggedInUser && egoId === loggedInUser.egoId
          ? setProfile(loggedInUser)
          : setProfile(await getProfile({ egoId })),
    }),
  ),
  withHandlers({
    submit: ({ profile, effects: { setUser } }) => async values => {
      await updateProfile({
        user: {
          ...profile,
          ...values,
        },
      }).then(async updatedProfile => {
        await setUser(updatedProfile);
      });
    },
  }),
  branch(
    ({ profile }) => !profile || profile.length === 0,
    renderComponent(({ match: { params: { egoId } } }) => <div>No user found with id {egoId}</div>),
  ),
)(({ state, effects: { setModal }, profile, theme, canEdit, submit, location: { hash } }) => (
  <div
    className={css`
      flex: 1;
    `}
  >
    <div
      className={css`
        background: url(${get(
            ROLES.reduce((acc, { type, banner }) => ({ ...acc, [type]: banner }), {}),
            get(profile.roles, 0),
            '',
          )})
          no-repeat;
        background-color: #1094d5;
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
          <div
            className={css`
              ${theme.pill} margin-bottom: 5px;
              padding: 6px 10px 4px 10px;
              display: flex;
            `}
          >
            {get(
              ROLES.reduce((acc, { type, icon }) => ({ ...acc, [type]: icon }), {}),
              get(profile.roles, 0),
              () => {},
            )({ height: '19px', fill: '#fff' })}
            <span
              className={css`
                font-family: Montserrat;
                font-size: 12px;
                font-weight: 300;
                letter-spacing: 0.2px;
                padding-left: 5px;
              `}
            >
              {(ROLES.find(({ type }) => type === get(profile, 'roles[0]')) || {}).displayName}
            </span>
          </div>
          <h4
            className={css`
              ${theme.h4};
            `}
          >{`${profile.firstName} ${profile.lastName}`}</h4>
          <div
            className={css`
              font-family: montserrat;
              font-size: 14px;
              color: #fff;
              ${theme.column};
            `}
          >
            <span>Contact Information</span>
            <span
              css={`
                text-decoration: underline;
              `}
            >
              {profile.email}
            </span>
            <span>{profile.jobTitle}</span>
            <span>{profile.institution}</span>
            <span>{[profile.city, profile.state, profile.country].filter(Boolean).join(', ')}</span>
            <span
              css={`
                margin-top: 5px;
              `}
            >
              <EditButton
                onClick={() =>
                  setModal({
                    title: 'Edit Basic Information',
                    component: <BasicInfoForm />,
                  })
                }
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
          <CompleteOMeter percentage={state.percentageFilled} role={get(profile.roles, 0)} />
          <div
            css={`
              font-family: 'Open Sans';
              font-size: 13px;
              font-style: italic;
              line-height: 1.69;
              color: #ffffff;
            `}
          >
            Complete your profile for a more personalized experience and to help encourage
            collaboration!
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
        box-shadow: 0 0 4.9px 0.1px #bbbbbb;
        border: solid 1px #e0e1e6;
        padding: 15px 0;
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
