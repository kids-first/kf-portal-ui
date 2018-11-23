import React from 'react';
import { compose, lifecycle, withState } from 'recompose';
import styled from 'react-emotion';
import { injectState } from 'freactal';
import { withTheme } from 'emotion-theming';

import projectDescriptionPath from './projectDescription.md';

import LoadingOnClick from 'components/LoadingOnClick';

import Column from 'uikit/Column';
import Row from 'uikit/Row';
import { WhiteButton, TealActionButton } from 'uikit/Button';
import Input from 'uikit/Input';

import { memoize } from 'services/utils';
import { createProject, getBillingGroups, getUser } from 'services/cavatica';

const StyledLabel = styled('label')`
  font-size: 14px;
  text-align: left;
  font-weight: 600;
  font-family: ${({ theme }) => theme.fonts.details};
  color: #343434;
  margin: 10px 0;
`;

const BillingGroupSelect = styled('select')`
  ${({ theme }) => theme.select};
  ${({ theme }) => theme.input};
`;

const enhance = compose(
  injectState,
  withTheme,
  withState('projectName', 'setProjectName', ''),
  withState('addingProject', 'setAddingProject', false),
  withState('billingGroups', 'setBillingGroups', []),
  withState('billingGroup', 'selectBillingGroup', null),
  lifecycle({
    async componentDidMount() {
      const { setBillingGroups, onInit } = this.props;
      onInit();
      getBillingGroups().then(bg => setBillingGroups(bg));
    },
  }),
);

const getProjectDescriptionTemplate = memoize(() =>
  fetch(projectDescriptionPath).then(res => res.text()),
);

const saveProject = async ({ projectName, billingGroups, selectedBillingGroup, onSuccess }) => {
  const USER_NAME_TEMPLATE_STRING = '<username>';
  const PROJECT_NAME_TEMPLATE_STRING = '<project-name>';
  const [descriptionTemplate, { username }] = await Promise.all([
    getProjectDescriptionTemplate(),
    getUser(),
  ]);

  const projectDescription = descriptionTemplate
    .split(PROJECT_NAME_TEMPLATE_STRING)
    .join(projectName)
    .split(USER_NAME_TEMPLATE_STRING)
    .join(username);

  if (billingGroups && billingGroups.length > 0) {
    const groupId = selectedBillingGroup || billingGroups[0].id;
    createProject({
      billing_group: groupId,
      name: projectName,
      description: projectDescription,
    }).then(response => onSuccess(response));
  }
};

const Create = ({
  projectName,
  setProjectName,
  setAddingProject,
  billingGroups,
  selectedBillingGroup,
  selectBillingGroup,
  onProjectCreated,
  onProjectCreationCancelled,
}) => (
  <Column>
    <StyledLabel>Project Name:</StyledLabel>
    <Input
      type="text"
      placeholder="Enter name of project"
      onChange={e => setProjectName(e.target.value)}
    />
    <StyledLabel>Billing Group:</StyledLabel>
    <BillingGroupSelect onChange={e => selectBillingGroup(e.target.value)}>
      {billingGroups.map((bg, i) => (
        <option key={i} value={bg.id}>
          {bg.name}
        </option>
      ))}
    </BillingGroupSelect>

    <Row mt="20px" justifyContent="space-between">
      <WhiteButton onClick={() => onProjectCreationCancelled()}>Cancel</WhiteButton>
      <LoadingOnClick
        onClick={async () => {
          await saveProject({
            projectName,
            selectedBillingGroup,
            billingGroups,
            onSuccess: ({ id }) => {
              onProjectCreated();
            },
          });
          setAddingProject(false);
          setProjectName('');
        }}
        render={({ loading, onClick }) => (
          <TealActionButton onClick={onClick} disabled={loading}>
            Save
          </TealActionButton>
        )}
      />
    </Row>
  </Column>
);

export default enhance(Create);
