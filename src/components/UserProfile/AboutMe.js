import * as React from 'react';
import { xor } from 'lodash';
import { compose, withState, withPropsOnChange, withHandlers } from 'recompose';
import { withRouter } from 'react-router-dom';
import { injectState } from 'freactal';
import styled from 'react-emotion';
import { withTheme } from 'emotion-theming';

import { Container, EditButton, H2, H3, H4 } from './ui';
import DeleteButton from 'components/loginButtons/DeleteButton';
import { trackUserInteraction, TRACKING_EVENTS } from 'services/analyticsTracking';
import InterestsAutocomplete from './InterestsAutocomplete';
import { ModalActionButton } from '../Modal';

import { Box, Flex, Section } from 'uikit/Core';
import Row from 'uikit/Row';
import Column from 'uikit/Column';
import { HollowButton } from 'uikit/Button';
import EditableLabel from 'uikit/EditableLabel';
import ExternalLink from 'uikit/ExternalLink';
import { Tag } from 'uikit/Tags';

const trackProfileInteraction = ({ action, value, type }) =>
  trackUserInteraction({
    category: TRACKING_EVENTS.categories.user.profile,
    action: `${type || ''} Edit: ${value ? `open` : `close`}`,
    label: action,
  });

const StyledSection = styled(Section)`
  padding: 5px 0;
  margin-top: 25px;
`;

const AboutMeContainer = styled(Container)`
  ${({ theme }) => theme.row};
`;

const ClickToAdd = styled('a')`
  font-size: 12px;
  text-decoration: underline;
`;

const InterestsCard = styled(Box)`
  border-radius: 5px;
  box-shadow: 0 0 2.9px 0.1px ${({ theme }) => theme.lightShadow};
`;

const InterestsContainer = styled(Box)`
  background-color: ${({ theme }) => theme.backgroundGrey};
  border: solid 1px ${({ theme }) => theme.greyScale8};
  border-radius: 5px;
`;

const ActionBar = styled(Row)`
  justify-content: space-between;
  border-radius: 5px;
  box-shadow: 0 0 2.9px 0.1px ${({ theme }) => theme.lightShadow};
  background-color: ${({ theme }) => theme.tertiaryBackground};
`;

const CancelButton = styled('button')`
  ${({ theme }) => theme.wizardButton};
`;
const SaveButton = styled(ModalActionButton)``;

export default compose(
  injectState,
  withState('isEditingBackgroundInfo', 'setEditingBackgroundInfo', false),
  withState('focusedTextArea', 'setFocusedTextArea', 'myBio'),
  withState('editingResearchInterests', 'setEditingResearchInterests', false),
  withHandlers({
    handleEditingBackgroundInfo: ({ setEditingBackgroundInfo }) => ({ type, value }) => {
      setEditingBackgroundInfo(value);
      trackProfileInteraction({ action: 'Background Information', value, type });
    },
    handleEditingResearchInterests: ({ setEditingResearchInterests }) => ({ type, value }) => {
      setEditingResearchInterests(value);
      trackProfileInteraction({ action: 'Research Interests', value, type });
    },
  }),
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
    handleEditingBackgroundInfo,
    setEditingBackgroundInfo,
    isEditingInfo,
    handleEditingResearchInterests,
    setFocusedTextArea,
    focusedTextArea,
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
    <Flex justifyContent="center" pt={4} pb={4}>
      <AboutMeContainer alignItems="flex-start">
        <Column width="65%" pt={2} justifyContent="space-around">
          <H2>
            Background Information
            {canEdit &&
              (!isEditingBackgroundInfo ? (
                <EditButton
                  onClick={() => handleEditingBackgroundInfo({ value: !isEditingBackgroundInfo })}
                />
              ) : (
                <SaveButton
                  onClick={async () => {
                    await submit({
                      bio: bioTextarea,
                      story: storyTextarea,
                    });
                    handleEditingBackgroundInfo({
                      value: false,
                      type: TRACKING_EVENTS.actions.save,
                    });
                  }}
                >
                  Save
                </SaveButton>
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
              autoFocus={focusedTextArea !== 'myStory'}
              type="textarea"
              isEditing={isEditingBackgroundInfo}
              disabled={true}
              required={false}
              name="bio"
              value={bioTextarea}
              onChange={e => setBioTextarea(e.target.value)}
              placeholderComponent={
                canEdit && (
                  <ClickToAdd
                    onClick={() => {
                      handleEditingBackgroundInfo({ value: !isEditingBackgroundInfo });
                      setFocusedTextArea('myBio');
                    }}
                  >
                    click to add
                  </ClickToAdd>
                )
              }
              saveOnKeyDown={false}
              renderButtons={() => <div />}
            />
          </StyledSection>
          <StyledSection className={'userStory'}>
            <H3>My story</H3>
            {canEdit && <H4>Share why you’re a part of the Kids First community.</H4>}
            <EditableLabel
              autoFocus={focusedTextArea === 'myStory'}
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
                  <ClickToAdd
                    onClick={() => {
                      handleEditingBackgroundInfo({ value: !isEditingBackgroundInfo });
                      setFocusedTextArea('myStory');
                    }}
                  >
                    click to add
                  </ClickToAdd>
                )
              }
              saveOnKeyDown={false}
              renderButtons={() => <div />}
            />
          </StyledSection>
          {localStorage.getItem('SHOW_DELETE_ACCOUNT') && (
            <div>
              <DeleteButton>Delete my account</DeleteButton>
            </div>
          )}
          {isEditingBackgroundInfo && (
            <ActionBar p={3}>
              <CancelButton
                onClick={() => {
                  setBioTextarea(profile.bio || '');
                  setStoryTextarea(profile.story || '');
                  handleEditingBackgroundInfo({ value: false });
                }}
              >
                Cancel
              </CancelButton>
              <SaveButton
                onClick={async () => {
                  await submit({
                    bio: bioTextarea,
                    story: storyTextarea,
                  });
                  handleEditingBackgroundInfo({ value: false, type: TRACKING_EVENTS.actions.save });
                }}
              >
                Save
              </SaveButton>
            </ActionBar>
          )}
        </Column>
        <InterestsCard width="35%" p={3} ml={4}>
          <H2>
            Research Interests
            {canEdit &&
              (!editingResearchInterests ? (
                <EditButton
                  onClick={() => {
                    handleEditingResearchInterests({ value: !editingResearchInterests });
                    setFocusedTextArea('interests');
                  }}
                />
              ) : (
                <React.Fragment>
                  <HollowButton
                    onClick={() => {
                      setWebsite(profile.website || '');
                      setGoogleScholarId(profile.googleScholarId || '');
                      setInterests(profile.interests || []);
                      handleEditingResearchInterests({ value: false });
                    }}
                  >
                    Cancel
                  </HollowButton>
                  <SaveButton
                    css={`
                      height: 30px;
                    `}
                    onClick={async () => {
                      await submit({
                        website,
                        googleScholarId,
                        interests,
                      });
                      handleEditingResearchInterests({
                        value: false,
                        type: TRACKING_EVENTS.actions.save,
                      });
                    }}
                  >
                    Save
                  </SaveButton>
                </React.Fragment>
              ))}
          </H2>
          <div>
            <InterestsContainer p={2}>
              <H3>Interests</H3>
              <H4>Tell people about your work background and your research specialties.</H4>
              <Row flexWrap="wrap" pt={2} pb={2}>
                {interests.map((x, i) => (
                  <Tag
                    key={i}
                    clickable={editingResearchInterests}
                    onClick={() => editingResearchInterests && setInterests(xor(interests, [x]))}
                  >
                    {x}
                  </Tag>
                ))}
              </Row>
              {editingResearchInterests && (
                <InterestsAutocomplete {...{ interests, setInterests }} />
              )}
            </InterestsContainer>
            <StyledSection>
              <H3>Website URL:</H3>
              <EditableLabel
                autoFocus={focusedTextArea === 'website'}
                isEditing={editingResearchInterests}
                disabled={true}
                required={false}
                name="website"
                value={website}
                onChange={e => setWebsite(e.target.value)}
                placeholderComponent={
                  canEdit && (
                    <ClickToAdd
                      onClick={() => {
                        handleEditingResearchInterests({ value: !editingResearchInterests });
                        setFocusedTextArea('website');
                      }}
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
                autoFocus={focusedTextArea === 'googleScholarId'}
                isEditing={editingResearchInterests}
                disabled={true}
                required={false}
                name="googleScholarId"
                value={googleScholarId}
                onChange={e => setGoogleScholarId(e.target.value)}
                placeholderComponent={
                  canEdit && (
                    <ClickToAdd
                      onClick={() => {
                        handleEditingResearchInterests({ value: !editingResearchInterests });
                        setFocusedTextArea('googleScholarId');
                      }}
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
        </InterestsCard>
      </AboutMeContainer>
    </Flex>
  ),
);
