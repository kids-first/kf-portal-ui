import React from 'react';
import { compose, withState, withPropsOnChange, withHandlers } from 'recompose';
import styled from 'react-emotion';
import { xor } from 'lodash';
import { withTheme } from 'emotion-theming';

import { withApi } from 'services/api';
import { DISEASE_AREAS, STUDY_SHORT_NAMES } from 'common/constants';
import { EditButton, ClickToAdd, InterestsCard, CardHeader } from './ui';
import { TRACKING_EVENTS, trackProfileInteraction } from 'services/analyticsTracking';
import InterestsAutocomplete from './InterestsAutocomplete';

import { Box, Flex } from 'uikit/Core';
import Row from 'uikit/Row';
import { Tag } from 'uikit/Tags';
import { H4 } from 'uikit/Headings';
import { WhiteButton, TealActionButton } from '../../uikit/Button';

const InterestsContainer = styled(Box)`
  background-color: ${({ theme }) => theme.backgroundGrey};
  border: solid 1px ${({ theme }) => theme.greyScale8};
  border-radius: 5px;
  display: flex;
  justify-content: center;
  flex-direction: column;
  padding: 10px;
  margin-bottom: 20px;
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

const InterestsSelect = styled('select')`
  ${({ theme }) => theme.select};
  ${({ theme }) => theme.input};
  text-transform: none;
`;

const InterestsOption = styled('option')``;
const ActionButtons = ({
  handleEditingResearchInterests,
  setInterests,
  submit,
  profile,
  interests,
}) => (
  <Flex justifyContent="flex-end">
    <WhiteButton
      mx="10px"
      onClick={() => {
        setInterests(profile.interests || []);
        handleEditingResearchInterests({ value: false });
      }}
    >
      Cancel
    </WhiteButton>
    <TealActionButton
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
    </TealActionButton>
  </Flex>
);

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
      <CardHeader>
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
            <ActionButtons
              {...{ handleEditingResearchInterests, setInterests, submit, profile, interests }}
            />
          ))}
      </CardHeader>
      {!interests.length && (
        <H4 mt={'29px'}>
          Please specify Kids First studies, diseases and other areas that interest you.
        </H4>
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
        <React.Fragment>
          <InterestsContainer>
            <InterestsLabel>Kids First Disease Areas:</InterestsLabel>
            <InterestsSelect
              onChange={e => {
                setInterests([...interests, e.target.value.toLowerCase()]);
              }}
              value=""
            >
              <InterestsOption value="" disabled selected>
                -- Select an option --
              </InterestsOption>
              {DISEASE_AREAS.filter(area => !interests.includes(area.toLowerCase())).map(area => (
                <InterestsOption value={area} key={area}>
                  {area}
                </InterestsOption>
              ))}
            </InterestsSelect>
            <InterestsLabel>Kids First Studies:</InterestsLabel>
            <InterestsSelect
              onChange={e => {
                setInterests([...interests, e.target.value.toLowerCase()]);
              }}
              value=""
            >
              <InterestsOption value="" disabled selected>
                -- Select an option --
              </InterestsOption>
              {STUDY_SHORT_NAMES.filter(study => !interests.includes(study.toLowerCase())).map(
                study => (
                  <InterestsOption value={study} key={study}>
                    {study}
                  </InterestsOption>
                ),
              )}
              >
            </InterestsSelect>
            <InterestsLabel>Other areas of interest:</InterestsLabel>
            <InterestsAutocomplete {...{ interests, setInterests }} />
          </InterestsContainer>

          <ActionButtons
            {...{ handleEditingResearchInterests, setInterests, submit, profile, interests }}
          />
        </React.Fragment>
      )}
    </InterestsCard>
  ),
);
