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
import { withFormik } from 'formik';
import { mapValues, get } from 'lodash';
import { css } from 'emotion';

import { ROLES } from 'common/constants';
import { updateProfile, getProfile } from 'services/profiles';
import BasicInfoForm from 'components/forms/BasicInfoForm';

import UserIntegrations from 'components/UserIntegrations';

const styles = {
  section: css`
    padding-top: 20px;
    display: flex;
  `,
  sectionLabel: css`
    color: #2b388f;
    font-weight: normal;
    font-size: 18px;
    flex: 1;
  `,
  sectionContent: css`
    flex:5;
  `

};

const uneditableFields = ['egoId', 'email', '_id'];
const requiredFields = ['lastName', 'firstName'];
const enhance = compose(
  withRouter,
  injectState,
  withState('profile', 'setProfile', {}),
  withState('isEditingBackgroundInfo', 'setEditingBackgroundInfo', false),
  withState('editingResearchInterests', 'setEditingResearchInterests', false),
  withTheme,
  lifecycle({
    async componentDidMount() {
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
  withFormik({
    enableReinitialize: true,
    mapPropsToValues: ({ profile }) => {
      return mapValues(profile, (val, key) => (key === 'roles' ? val && val[0] : val) || '');
    },
    validate: (values, props) => {
      let errors = {};
      if (!values.roles) {
        errors.roles = 'Must select a role';
      } else if (!ROLES.includes(values.roles)) {
        errors.roles = 'Invalid role';
      }
      if (!values.firstName || values.firstName.length === 0) {
        errors.firstName = 'First name is required';
      }
      if (!values.lastName || values.lastName.length === 0) {
        errors.lastName = 'Last name is required';
      }
      return errors;
    },
    handleSubmit: async (
      values,
      {
        props: { state: { loggedInUser }, effects: { setUser }, onFinish, setEditingAll },
        setSubmitting,
        setErrors,
      },
    ) => {
      const { email, ...rest } = values;
      updateProfile({
        user: { ...mapValues(rest, (val, key) => val || null) },
      }).then(
        async profile => {
          await setUser({ ...profile, email });
          setEditingAll(false);
          setSubmitting(false);
          onFinish && onFinish();
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
) (
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
                  () => { },
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
          </label>
            ))}
        {isEditingAll &&
              canEdit && (
                <span>
                  <button type="submit" disabled={isSubmitting}>
                    Submit
              </button>
                </span>
              )}
            {!isEditingAll && canEdit && <button onClick={() => setEditingAll(true)}>Edit all</button>}
      </form>
          {canEdit && (
            <div>
              <LogoutButton />
              <button
                onClick={async () => {
                  await deleteProfile({ user: values });
                  await logoutAll();
                  await effects.setUser(null);
                  await effects.setToken('');
                  effects.clearIntegrationTokens();
                  history.push('/');
                }}
              >
                DELETE ACCOUNT
          </button>
            </div>
          )}
          {canEdit &&
            <div css={styles.section} >
              <span css={styles.sectionLabel} >Integrations</span>
              <div css={styles.sectionContent}><UserIntegrations /></div>
            </div>
          }
        </div >
        );
      };
      
      export default enhance(UserProfile);
