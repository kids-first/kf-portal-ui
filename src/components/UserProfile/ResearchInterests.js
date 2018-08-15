import React from 'react';
import { compose, withState, withPropsOnChange, withHandlers } from 'recompose';
import styled from 'react-emotion';
import { xor } from 'lodash';

import { withApi } from 'services/api';
import { DISEASE_AREAS, STUDY_SHORT_NAMES } from 'common/constants';
import { EditButton, H2, H4, SaveButton, ClickToAdd, InterestsCard } from './ui';
import { TRACKING_EVENTS, trackProfileInteraction } from 'services/analyticsTracking';
import InterestsAutocomplete from './InterestsAutocomplete';

import { Box, Flex } from 'uikit/Core';
import Row from 'uikit/Row';
import { HollowButton } from 'uikit/Button';
import { Tag } from 'uikit/Tags';
import { withTheme } from 'emotion-theming';

const InterestsContainer = styled(Box)`
  background-color: ${({ theme }) => theme.backgroundGrey};
  border: solid 1px ${({ theme }) => theme.greyScale8};
  border-radius: 5px;
  display: flex;
  justify-content: center;
  flex-direction: column;
  padding: 10px;
`;

const InterestsLabel = styled('div')`
  font-family: ${({ theme }) => theme.fonts.details};
  font-size: 13px;
  font-weight: 600;
  font-style: normal;
  font-stretch: normal;
  line-height: 2;
  letter-spacing: normal;
  text-align: left;
  color: ${({ theme }) => theme.greyScale1};
  width: 80%;
`;

export default compose(
  withTheme,
  withState('editingResearchInterests', 'setEditingResearchInterests', false),
  withState('focusedTextArea', 'setFocusedTextArea', 'myBio'),
  withState('interests', 'setInterests', ({ profile }) => profile.interests || []),
  withState('interestAutocomplete', 'setInterestAutocomplete', ''),
  withHandlers({
    handleEditingResearchInterests: ({ setEditingResearchInterests }) => ({ type, value }) => {
      setEditingResearchInterests(value);
      trackProfileInteraction({ action: 'Research Interests', value, type });
    },
  }),
  withPropsOnChange(['profile'], ({ setInterests, profile }) => {
    setInterests(profile.interests || []);
  }),
  withApi,
)(
  ({
    theme,
    api,
    profile,
    editingResearchInterests,
    setEditingResearchInterests,
    canEdit,
    submit,
    focusedTextArea,
    setFocusedTextArea,
    handleEditingResearchInterests,
    interestAutocomplete,
    setInterestAutocomplete,
    interests,
    setInterests,
  }) => (
    <InterestsCard p={3}>
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
            <Flex>
              <HollowButton
                onClick={() => {
                  setInterests(profile.interests || []);
                  handleEditingResearchInterests({ value: false });
                }}
              >
                Cancel
              </HollowButton>
              <SaveButton
                onClick={async () => {
                  await submit({
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
            </Flex>
          ))}
      </H2>
      <div>
        {!interests.length && (
          <H4>Please specify Kids First studies, diseases and other areas that interest you.</H4>
        )}
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
          <InterestsContainer>
            <InterestsLabel>Kids First Disease Area:</InterestsLabel>
            <select
              css={`
                ${theme.select} ${theme.input};
              `}
              onChange={e => {
                setInterests([...interests, e.target.value]);
              }}
              value=""
            >
              <option value="" disabled selected>
                -- Select an option --
              </option>
              {DISEASE_AREAS.filter(area => !interests.includes(area)).map(area => (
                <option value={area} key={area}>
                  {area}
                </option>
              ))}
            </select>
            <InterestsLabel>Kids First Studies:</InterestsLabel>
            <select
              css={`
                ${theme.select} ${theme.input};
              `}
              onChange={e => {
                setInterests([...interests, e.target.value]);
              }}
              value=""
            >
              <option value="" disabled selected>
                -- Select an option --
              </option>
              {STUDY_SHORT_NAMES.filter(study => !interests.includes(study)).map(study => (
                <option value={study} key={study}>
                  {study}
                </option>
              ))}
              >
            </select>
            <InterestsLabel>Other areas of interest:</InterestsLabel>
            <InterestsAutocomplete {...{ interests, setInterests }} />
          </InterestsContainer>
        )}

        {canEdit &&
          !interests.length &&
          !editingResearchInterests && (
            <ClickToAdd
              onClick={() => {
                handleEditingResearchInterests({ value: !editingResearchInterests });
                setFocusedTextArea('googleScholarId');
              }}
            >
              click to add
            </ClickToAdd>
          )}
      </div>
    </InterestsCard>
  ),
);
