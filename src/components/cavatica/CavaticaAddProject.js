import React, { Fragment } from 'react';
import { compose, lifecycle, withState } from 'recompose';
import { withTheme } from 'emotion-theming';
import styled from 'react-emotion';

import Row from 'uikit/Row';
import Input from 'uikit/Input';
import { injectState } from 'freactal';
import { getBillingGroups, saveProject } from 'services/cavatica';
import LoadingOnClick from 'components/LoadingOnClick';
import PlusIcon from 'icons/PlusCircleIcon';
import { WhiteButton, TealActionButton } from 'uikit/Button';
import Select from 'uikit/Select';

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
  min-width: 15%;
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
  min-width: 1%;
  fill: ${({ theme }) => theme.tertiary};
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
      const { setBillingGroups } = this.props;
      getBillingGroups().then(bg => setBillingGroups(bg));
    },
  }),
);

const CavaticaAddProject = ({
  theme,
  projectName,
  setProjectName,
  addingProject,
  setAddingProject,
  setSelectedProject,
  billingGroups,
  selectedBillingGroup,
  selectBillingGroup,
  onSuccess,
}) => {
  const onSaveButtonClick = async () => {
    saveProject({
      projectName,
      selectedBillingGroup,
      billingGroups,
    }).then(({ id }) => {
      setAddingProject(false);
      setProjectName('');
      setSelectedProject(id);
      onSuccess();
    });
  };
  const onProjectNameChange = e => setProjectName(e.target.value);
  const onBillingGroupSelect = e => selectBillingGroup(e.target.value);
  const onCancelClick = () => setAddingProject(false);
  const onCreateButtonClick = () => setAddingProject(true);
  return (
    <Container>
      {addingProject ? (
        <Fragment>
          <AddIcon width={15} height={15} fill={theme.tertiary} />
          <InputLabel>Create a project</InputLabel>
          <Input
            italic
            type="text"
            placeholder="Enter name of project"
            value={projectName}
            onChange={onProjectNameChange}
          />
          <Select onChange={onBillingGroupSelect}>
            {billingGroups.map((bg, i) => (
              <option key={i} value={bg.id}>
                {bg.name}
              </option>
            ))}
          </Select>
          <LoadingOnClick
            onClick={onSaveButtonClick}
            render={({ loading, onClick }) => (
              <TealActionButton disabled={loading} onClick={onClick}>
                Save
              </TealActionButton>
            )}
          />
          <WhiteButton onClick={onCancelClick}>Cancel</WhiteButton>
        </Fragment>
      ) : (
        <CreateButton onClick={onCreateButtonClick}>
          <AddIcon width={12} height={12} />
          Create a project
        </CreateButton>
      )}
    </Container>
  );
};

export default enhance(CavaticaAddProject);
