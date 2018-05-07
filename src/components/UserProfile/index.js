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

export const Container = props => <div {...props} className={`container ${props.className}`} />;

export const EditButton = compose(withTheme)(({ theme, ...props }) => (
  <button className={theme.hollowButton} {...props}>
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
      const { state: { loggedInUser }, match: { params: { egoId } }, setProfile, api } = this.props;
      loggedInUser && egoId === loggedInUser.egoId
        ? setProfile(loggedInUser)
        : setProfile(await getProfile(api)({ egoId }));
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
          : setProfile(await getProfile(api)({ egoId })),
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
  <div className={theme.userProfile({ ROLES, profile })}>
    <div className={`hero`}>
      <Container className={theme.row}>
        <Gravtar email={profile.email || ''} size={173} />
        <div className={`profileInfo ${theme.column}`}>
          <RoleIconButton />
          <h4 className={theme.h4}>{`${profile.firstName} ${profile.lastName}`}</h4>
          <div className={`content ${theme.column}`}>
            <span>Contact Information</span>
            <span className={`email`}>{profile.email}</span>
            <span>{profile.jobTitle}</span>
            <span>{profile.institution}</span>
            <span>{[profile.city, profile.state, profile.country].filter(Boolean).join(', ')}</span>
            <span>
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
        <div className={`progressContainer ${theme.column}`}>
          <CompletionWrapper completed={state.percentageFilled}>
            <CompleteOMeter percentage={state.percentageFilled} />
          </CompletionWrapper>

          <div
            className={css`
              font-family: 'Open Sans';
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
