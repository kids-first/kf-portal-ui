import * as React from 'react';
import { xor } from 'lodash';
import { css } from 'react-emotion';
import { compose, withState, withPropsOnChange } from 'recompose';
import { withRouter } from 'react-router-dom';
import { injectState } from 'freactal';
import SaveIcon from 'react-icons/lib/md/save';
import Autocomplete from 'react-autocomplete';
import styled from 'react-emotion';

import { withTheme } from 'emotion-theming';
import EditableLabel from 'uikit/EditableLabel';
import ExternalLink from 'uikit/ExternalLink';
import { Container, EditButton, H2, H3, H4 } from './';

const ClickToAdd = styled('span')`
  color: ${props => props.theme.primary};
  font-size: 12px;
  font-family: Montserrat;
  text-decoration: underline;
  &:hover {
    cursor: pointer;
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

export default compose(
  injectState,
  withState('isEditingBackgroundInfo', 'setEditingBackgroundInfo', false),
  withState('editingResearchInterests', 'setEditingResearchInterests', false),
  withTheme,
  withState('bioTextarea', 'setBioTextarea', ({ profile }) => profile.bio || ''),
  withState('storyTextarea', 'setStoryTextarea', ({ profile }) => profile.story || ''),
  withState('website', 'setWebsite', ({ profile }) => profile.website || ''),
  withState(
    'googleScholarId',
    'setGoogleScholarId',
    ({ profile }) => profile.googleScholarId || '',
  ),
  withState('interests', 'setInterests', ({ profile }) => profile.interests || []),
  withState('interestAutocomplete', 'setInterestAutocomplete', ''),
  withPropsOnChange(
    ['profile'],
    ({
      setBioTextarea,
      setStoryTextarea,
      setInterests,
      setWebsite,
      setGoogleScholarId,
      profile,
    }) => {
      setBioTextarea(profile.bio || '');
      setStoryTextarea(profile.story || '');
      setInterests(profile.interests || []);
      setWebsite(profile.website || '');
      setGoogleScholarId(profile.googleScholarId || '');
    },
  ),
  withRouter,
)(
  ({
    profile,
    theme,
    canEdit,
    submit,
    isEditingBackgroundInfo,
    setEditingBackgroundInfo,
    editingResearchInterests,
    setEditingResearchInterests,
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
              <H4>
                Share information about your professional background and your research interests.
              </H4>
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
            {canEdit && <H4>Share why you’re a part of the Kids First community.</H4>}
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
                  inputProps={{
                    className: theme.input,
                    placeholder: '🔍Search for interests',
                  }}
                  getItemValue={item => item.label}
                  items={xor(
                    ['lung', 'heart', 'blood', 'stomach', 'tongue', 'skin'],
                    interests,
                  ).map(item => ({
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
                renderNonEditing={v => (
                  <ExternalLink href={`https://scholar.google.fr/citations?user=${v}`}>
                    {v}
                  </ExternalLink>
                )}
                renderButtons={() => <div />}
              />
            </StyledSection>
          </div>
        </div>
      </Container>
    </div>
  ),
);
