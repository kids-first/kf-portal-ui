import * as React from 'react';
import { get, xor } from 'lodash';
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
import { withRouter } from 'react-router-dom';
import { injectState } from 'freactal';
import styled from 'react-emotion';
import PencilIcon from 'react-icons/lib/fa/pencil';
import SaveIcon from 'react-icons/lib/md/save';
import Autocomplete from 'react-autocomplete';

import { withTheme } from 'emotion-theming';

import { ROLES } from 'common/constants';
import { updateProfile, getProfile } from 'services/profiles';
import BasicInfoForm from 'components/forms/BasicInfoForm';

import EditableLabel from 'uikit/EditableLabel';

import researcherBanner from 'assets/user-banner-researcher.jpg';
import patientBanner from 'assets/user-banner-patient.jpg';

import CompleteOMeter from 'components/CompleteOMeter';

import Gravtar from 'uikit/Gravatar';
import ExternalLink from 'uikit/ExternalLink';

const roleToBanner = {
  researcher: researcherBanner,
  patient: patientBanner,
  clinician: 'tbd',
};

const H2 = styled('h2')`
  ${props => props.theme.profileH2};
`;

const H3 = styled('h3')`
  ${props => props.theme.profileH3};
`;

const H4 = styled('h4')`
  font-family: 'Open Sans';
  font-size: 13px;
  font-style: italic;
  line-height: 1.85;
  text-align: left;
  color: #74757d;
  margin: 0;
  font-weight: normal;
`;

const Container = styled('div')`
  justify-content: space-around;
  align-items: center;
  height: 100%;
  width: 76%;
`;

const ClickToAdd = styled('span')`
  color: ${props => props.theme.primary};
  font-size: 12px;
  font-family: Montserrat;
  text-decoration: underline;
  &:hover {
    color: ${props => props.theme.highlight};
    font-size: 12px;
    font-family: Montserrat;
    text-decoration: underline;
  }
`;

const StyledSection = styled('section')`
  padding: 5px 0;
`;

const SaveButton = compose(withTheme)(({ theme, ...props }) => (
  <button css={theme.hollowButton} {...props}>
    <SaveIcon /> Save
  </button>
));

export const EditButton = compose(withTheme)(({ theme, ...props }) => (
  <button css={theme.hollowButton} {...props}>
    <PencilIcon /> Edit
  </button>
));

export default compose(
  injectState,
  withState('profile', 'setProfile', {}),
  withState('isEditingBackgroundInfo', 'setEditingBackgroundInfo', false),
  withState('editingResearchInterests', 'setEditingResearchInterests', false),
  withTheme,
  lifecycle({
    async componentDidMount(): void {
      const { state: { loggedInUser }, match: { params: { egoId } }, setProfile } = this.props;
      loggedInUser && egoId === loggedInUser.egoId
        ? setProfile(loggedInUser)
        : setProfile(await getProfile({ egoId }));
    },
  }),
  withState('bioTextarea', 'setBioTextarea', ({ profile }) => profile.bio || ''),
  withState('storyTextarea', 'setStoryTextarea', ({ profile }) => profile.story || ''),
  withState('website', 'setWebsite', ({ profile }) => profile.website || ''),
  withState(
    'googleScholarId',
    'setGoogleScholarId',
    ({ profile }) => profile.googleScholarId || '',
  ),
  withState('interests', 'setInterests', ({ profile }) => profile.interests || []),
  withPropsOnChange(
    ['profile'],
    ({
      setBioTextarea,
      setStoryTextarea,
      setInterests,
      setWebsite,
      setGoogleScholarId,
      profile,
      state: { loggedInUser },
    }) => {
      setBioTextarea(profile.bio || '');
      setStoryTextarea(profile.story || '');
      setInterests(profile.interests || []);
      setWebsite(profile.website || '');
      setGoogleScholarId(profile.googleScholarId || '');
      return {
        canEdit: loggedInUser && profile.egoId === loggedInUser.egoId,
      };
    },
  ),
  withState('interestAutocomplete', 'setInterestAutocomplete', ''),
  withPropsOnChange(
    ['match'],
    async ({ match: { params: { egoId } }, setProfile, state: { loggedInUser } }) => ({
      notUsed:
        loggedInUser && egoId === loggedInUser.egoId
          ? setProfile(loggedInUser)
          : setProfile(await getProfile({ egoId })),
    }),
  ),
  withRouter,
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
)(
  ({
    state,
    effects: { setModal },
    profile,
    theme,
    canEdit,
    isEditingBackgroundInfo,
    setEditingBackgroundInfo,
    editingResearchInterests,
    setEditingResearchInterests,
    submit,
    renderEditingButtons,
    bioTextarea,
    setBioTextarea,
    storyTextarea,
    setStoryTextarea,
    website,
    setWebsite,
    googleScholarId,
    setGoogleScholarId,
    interestAutocomplete,
    setInterestAutocomplete,
    interests,
    setInterests,
  }) => (
    <div
      className={css`
        display: flex;
        flex-direction: column;
        height: 100%;
      `}
    >
      <div
        className={css`
          background: url(${roleToBanner[profile.roles]}) no-repeat;
          background-color: #1094d5;
          height: 330px;
          align-items: center;
          padding: 0;
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
              <span>
                {[profile.city, profile.state, profile.country].filter(Boolean).join(', ')}
              </span>
              <span
                css={`
                  margin-top: 5px;
                `}
              >
                <EditButton onClick={() => setModal(<BasicInfoForm />)} />
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
              <a className="active">About Me</a>
            </li>
            <li>
              <a>Settings & Privacy</a>
            </li>
          </ul>
        </Container>
      </div>
      <div
        className={css`
          display: flex;
          justify-content: center;
          padding: 50px 0;
          height: 100%;
          background-image: linear-gradient(to bottom, #fff 0%, #fff 70%, transparent 95%);
        `}
      >
        <Container
          className={css`
            ${theme.row} align-items: flex-start;
          `}
        >
          <div
            className={css`
              width: 65%;
              ${theme.column} justify-content: space-around;
            `}
          >
            <H2>
              Background Information
              {canEdit &&
                (!isEditingBackgroundInfo ? (
                  <EditButton onClick={() => setEditingBackgroundInfo(!isEditingBackgroundInfo)} />
                ) : (
                  <SaveButton
                    onClick={async () => {
                      await submit({
                        bio: bioTextarea,
                        story: storyTextarea,
                      });
                      setEditingBackgroundInfo(false);
                    }}
                  />
                ))}
            </H2>
            <StyledSection>
              <H3>My bio</H3>
              {canEdit && (
                <H4>Tell people about your work background and your research specialties.</H4>
              )}
              <EditableLabel
                type="textarea"
                isEditing={isEditingBackgroundInfo}
                disabled={true}
                required={false}
                name="bio"
                value={bioTextarea}
                onChange={e => setBioTextarea(e.target.value)}
                placeholderComponent={
                  canEdit && (
                    <ClickToAdd onClick={() => setEditingBackgroundInfo(!isEditingBackgroundInfo)}>
                      click to add
                    </ClickToAdd>
                  )
                }
                saveOnKeyDown={false}
                renderButtons={() => <div />}
              />
            </StyledSection>
            <StyledSection>
              <H3>My story</H3>
              {canEdit && (
                <H4>Tell people about your story and what brings you to this network.</H4>
              )}
              <EditableLabel
                type="textarea"
                isEditing={isEditingBackgroundInfo}
                disabled={true}
                required={false}
                name="story"
                value={storyTextarea}
                onChange={e => setStoryTextarea(e.target.value)}
                displayButtons={true}
                placeholderComponent={
                  canEdit && (
                    <ClickToAdd onClick={() => setEditingBackgroundInfo(!isEditingBackgroundInfo)}>
                      click to add
                    </ClickToAdd>
                  )
                }
                saveOnKeyDown={false}
                renderButtons={() => <div />}
              />
            </StyledSection>
            {isEditingBackgroundInfo && (
              <div
                css={`
                  ${theme.row} justify-content: space-between;
                  border-radius: 5px;
                  box-shadow: 0 0 2.9px 0.1px #a0a0a3;
                  padding: 1em;
                `}
              >
                <button
                  onClick={() => {
                    setBioTextarea(profile.bio || '');
                    setStoryTextarea(profile.story || '');
                    setEditingBackgroundInfo(false);
                  }}
                  css={theme.hollowButton}
                >
                  Cancel
                </button>
                <SaveButton
                  onClick={async () => {
                    await submit({
                      bio: bioTextarea,
                      story: storyTextarea,
                    });
                    setEditingBackgroundInfo(false);
                  }}
                />
              </div>
            )}
          </div>
          <div
            className={css`
              border-radius: 5px;
              background-color: #ffffff;
              box-shadow: 0 0 2.9px 0.1px #a0a0a3;
              width: 35%;
              padding: 0 1em 1em 1em;
              margin-left: 1em;
            `}
          >
            <H2>
              Research Interests
              {canEdit &&
                (!editingResearchInterests ? (
                  <EditButton
                    onClick={() => setEditingResearchInterests(!editingResearchInterests)}
                  />
                ) : (
                  <SaveButton
                    onClick={async () => {
                      await submit({
                        website,
                        googleScholarId,
                        interests,
                      });
                      setEditingResearchInterests(false);
                    }}
                  />
                ))}
            </H2>
            <div>
              <div
                css={`
                  background-color: #f4f5f8;
                  border: solid 1px #d4d6dd;
                  padding: 0.5em;
                  border-radius: 5px;
                `}
              >
                <H3>Interests</H3>
                <H4>Tell people about your work background and your research specialties.</H4>
                <div
                  css={`
                    ${theme.row};
                    padding: 5px 0;
                  `}
                >
                  {interests.map(i => (
                    <div
                      key={i}
                      css={`
                        ${theme.listPill} ${editingResearchInterests && theme.listPillClickable};
                      `}
                      onClick={() => setInterests(xor(interests, [i]))}
                    >
                      {i}
                    </div>
                  ))}
                </div>
                {editingResearchInterests && (
                  <Autocomplete
                    inputProps={{ className: theme.input }}
                    getItemValue={item => item.label}
                    items={xor(['lung', 'heart', 'blood'], interests).map(item => ({
                      label: item,
                    }))}
                    renderItem={(item, isHighlighted) => (
                      <div style={{ background: isHighlighted ? 'lightgray' : 'white' }}>
                        {item.label}
                      </div>
                    )}
                    value={interestAutocomplete}
                    onChange={e => setInterestAutocomplete(e.target.value)}
                    onSelect={val => {
                      setInterests([...new Set([...interests, val])]);
                      setInterestAutocomplete('');
                    }}
                    menuStyle={{
                      backgroundcolor: '#fff',
                      border: `1px solid ${theme.greyScale4}`,
                      width: '100%',
                      fontFamily: 'montserrat',
                      fontSize: '14px',
                    }}
                  />
                )}
              </div>
              <StyledSection>
                <H3>Website URL:</H3>
                <EditableLabel
                  isEditing={editingResearchInterests}
                  disabled={true}
                  required={false}
                  name="website"
                  value={website}
                  onChange={e => setWebsite(e.target.value)}
                  placeholderComponent={
                    canEdit && (
                      <ClickToAdd
                        onClick={() => setEditingResearchInterests(!editingResearchInterests)}
                      >
                        click to add
                      </ClickToAdd>
                    )
                  }
                  saveOnKeyDown={false}
                  renderButtons={() => <div />}
                  renderNonEditing={v => <ExternalLink href={v}>{v}</ExternalLink>}
                />
              </StyledSection>
              <StyledSection>
                <H3>Google Scholar ID: </H3>
                <EditableLabel
                  isEditing={editingResearchInterests}
                  disabled={true}
                  required={false}
                  name="googleScholarId"
                  value={googleScholarId}
                  onChange={e => setGoogleScholarId(e.target.value)}
                  placeholderComponent={
                    canEdit && (
                      <ClickToAdd
                        onClick={() => setEditingResearchInterests(!editingResearchInterests)}
                      >
                        click to add
                      </ClickToAdd>
                    )
                  }
                  saveOnKeyDown={false}
                  renderButtons={() => <div />}
                />
              </StyledSection>
            </div>
          </div>
        </Container>
      </div>
    </div>
  ),
);
