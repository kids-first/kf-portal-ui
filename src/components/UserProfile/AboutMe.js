import React from 'react';
import { compose, withState, withPropsOnChange, withHandlers } from 'recompose';
import { withRouter } from 'react-router-dom';
import { injectState } from 'freactal';
import styled from 'react-emotion';
import { withTheme } from 'emotion-theming';

import { Container, EditButton, H2, SaveButton, StyledSection, ClickToAdd, CardHeader } from './ui';
import ResearchInterests from './ResearchInterests';
import FindMe from './FindMe';
import DeleteButton from 'components/loginButtons/DeleteButton';
import { trackProfileInteraction, TRACKING_EVENTS } from 'services/analyticsTracking';

import { Flex } from 'uikit/Core';
import Row from 'uikit/Row';
import Column from 'uikit/Column';
import EditableLabel from 'uikit/EditableLabel';
import Contact from './Contact';
import { H3, H4 } from 'uikit/Headings';
import { WhiteButton } from '../../uikit/Button';

const ActionBar = styled(Row)`
  justify-content: flex-end;
  border-radius: 5px;
  box-shadow: 0 0 2.9px 0.1px ${({ theme }) => theme.lightShadow};
  background-color: ${({ theme }) => theme.tertiaryBackground};
`;

export default compose(
  injectState,
  withState('isEditingBackgroundInfo', 'setEditingBackgroundInfo', false),
  withState('focusedTextArea', 'setFocusedTextArea', 'myBio'),
  withState('editingResearchInterests', 'setEditingResearchInterests', false),
  withHandlers({
    handleEditingBackgroundInfo: ({ setEditingBackgroundInfo }) => ({ type, value }) => {
      setEditingBackgroundInfo(value);
      trackProfileInteraction({ action: 'Profile', value, type });
    },
  }),
  withTheme,
  withState('bioTextarea', 'setBioTextarea', ({ profile }) => profile.bio || ''),
  withState('storyTextarea', 'setStoryTextarea', ({ profile }) => profile.story || ''),
  withPropsOnChange(['profile'], ({ setBioTextarea, setStoryTextarea, profile }) => {
    setBioTextarea(profile.bio || '');
    setStoryTextarea(profile.story || '');
  }),
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
    setFocusedTextArea,
    focusedTextArea,
    bioTextarea,
    setBioTextarea,
    storyTextarea,
    setStoryTextarea,
  }) => (
    <Flex justifyContent="center" pt={4} pb={4}>
      <Container row alignItems="flex-start">
        <Column width="65%" pt={2} pr={50} justifyContent="space-around">
          <CardHeader mb="29px">
            Profile
            {canEdit &&
              (!isEditingBackgroundInfo ? (
                <EditButton
                  onClick={() =>
                    handleEditingBackgroundInfo({
                      value: !isEditingBackgroundInfo,
                    })
                  }
                />
              ) : (
                <Flex>
                  <WhiteButton
                    mx="10px"
                    onClick={() => {
                      setBioTextarea(profile.bio || '');
                      setStoryTextarea(profile.story || '');
                      handleEditingBackgroundInfo({ value: false });
                    }}
                  >
                    Cancel
                  </WhiteButton>
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
                </Flex>
              ))}
          </CardHeader>

          <StyledSection>
            <H3 lineHeight="1.71" letterSpacing="0.2px">
              My bio
            </H3>
            {(bioTextarea === '' || isEditingBackgroundInfo) &&
              canEdit && (
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
                      handleEditingBackgroundInfo({
                        value: !isEditingBackgroundInfo,
                      });
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
            <H3 lineHeight="1.71" letterSpacing="0.2px" mt="40px">
              My story
            </H3>
            {(storyTextarea === '' || isEditingBackgroundInfo) &&
              canEdit && <H4>Share why you’re a part of the Kids First community.</H4>}
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
                      handleEditingBackgroundInfo({
                        value: !isEditingBackgroundInfo,
                      });
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
              <WhiteButton
                mx="10px"
                onClick={() => {
                  setBioTextarea(profile.bio || '');
                  setStoryTextarea(profile.story || '');
                  handleEditingBackgroundInfo({ value: false });
                }}
              >
                Cancel
              </WhiteButton>
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
            </ActionBar>
          )}
          <Contact mt={'50px'} profile={profile} />
        </Column>

        <Column width="35%">
          <ResearchInterests {...{ profile, canEdit, submit }} />
          {Object.keys(profile).length && <FindMe {...{ profile, canEdit, submit }} />}
        </Column>
      </Container>
    </Flex>
  ),
);
