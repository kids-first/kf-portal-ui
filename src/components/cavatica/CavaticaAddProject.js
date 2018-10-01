import React, { Fragment } from 'react';
import { compose, withState } from 'recompose';
import { withTheme } from 'emotion-theming';
import styled from 'react-emotion';

import Row from 'uikit/Row';
import Input from 'uikit/Input';
import { ActionButton } from 'uikit/Button';
import NiceWhiteButton from 'uikit/NiceWhiteButton';
import { CancelButton } from 'components/Modal/ui';
import { injectState } from 'freactal';
import { createProject, getBillingGroups } from 'services/cavatica';
import LoadingOnClick from 'components/LoadingOnClick';
import PlusIcon from 'icons/PlusCircleIcon';
import { WhiteButton, TealActionButton } from 'uikit/Button';
import projectDescriptionPath from './projectDescription.md';

const Container = styled(Row)`
  align-items: center;
  flex: 1;
  & > *:not(:first-child) {
    margin-left: 10px;
  }
`;

const CreateButton = styled(WhiteButton)`
  font-size: 11.5px;
  border-radius: 19px;

  &:hover {
    svg {
      fill: ${({ theme }) => theme.white};
    }
  }
`;

const InputLabel = styled(Row)`
  font-size: 12px;
  line-height: 2.39;
  align-items: center;
  color: ${({ theme }) => theme.tertiary};
  text-transform: uppercase;
  &::after {
    margin-left: 13px;
    font-size: 1.5rem;
    content: '›';
    margin-top: -4px;
  }
`;

const AddIcon = styled(PlusIcon)`
  margin-top: 1px;
  margin-right: 4px;
  fill: ${({ theme }) => theme.tertiary};
`;

const enhance = compose(
  injectState,
  withTheme,
  withState('projectName', 'setProjectName', ''),
  withState('addingProject', 'setAddingProject', false),
);

const saveProject = async ({ projectName, onSuccess }) => {
  const [billingGroups, projectDescription] = await Promise.all([
    getBillingGroups(),
    fetch(projectDescriptionPath).then(res => res.text()),
  ]);
  if (billingGroups && billingGroups.length > 0) {
    const groupId = billingGroups[0].id;
    createProject({
      billing_group: groupId,
      name: projectName,
      description: projectDescription,
    }).then(response => onSuccess());
  }
};

const CavaticaAddProject = ({
  state,
  theme,
  projectName,
  setProjectName,
  addingProject,
  setAddingProject,
  ...props
}) => (
  <Container>
    {addingProject ? (
      <Fragment>
        <AddIcon width={15} height={15} fill={theme.tertiary} />
        <InputLabel>Create a project</InputLabel>
        <Input
          italic
          flex={1}
          type="text"
          placeholder="Enter name of project"
          value={projectName}
          onChange={e => setProjectName(e.target.value)}
        />
        <LoadingOnClick
          onClick={async () => {
            await saveProject({ projectName, onSuccess: props.onSuccess });
            setAddingProject(false);
            setProjectName('');
          }}
          render={({ loading, onClick }) => (
            <TealActionButton disabled={loading} onClick={onClick}>
              Save
            </TealActionButton>
          )}
        />
        <WhiteButton onClick={() => setAddingProject(false)}>Cancel</WhiteButton>
      </Fragment>
    ) : (
      <CreateButton onClick={() => setAddingProject(true)}>
        <AddIcon width={12} height={12} />
        Create a project
      </CreateButton>
    )}
  </Container>
);

export default enhance(CavaticaAddProject);
