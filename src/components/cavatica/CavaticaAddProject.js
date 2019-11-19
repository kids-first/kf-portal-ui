import React, { Component } from 'react';
import { compose, withState, withTheme } from 'recompose';
import styled from 'react-emotion';

import Row from 'uikit/Row';
import Input from 'uikit/Input';
import { injectState } from 'freactal';
import { getBillingGroups, saveProject } from 'services/cavatica';
import PlusIcon from 'icons/PlusCircleIcon';
import { WhiteButton, TealActionButton } from 'uikit/Button';
import Select from 'uikit/Select';
import { getMsgFromErrorOrElse } from 'utils';
import { Result, Button } from 'antd';

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
  withState('billingGroup', 'selectBillingGroup', null),
);

const defaultState = {
  projectName: '',
  billingGroups: [],
  selectedBillingGroup: null,
  error: null,
  addingProject: false,
  //Do not show 'try again' if getBillingGroups fails. To show it, we should add a key to the component and change it to refresh the component. The parent is a bit too complicated to add extra logic to it so I prefer to make things simple...
  isErrorFromBillingGroups: false,
};

class CavaticaAddProject extends Component {
  state = {
    ...defaultState,
  };

  async componentDidMount() {
    try {
      const billingGroups = (await getBillingGroups()) || [];
      this.setState({ billingGroups });
    } catch (error) {
      this.setState({ error, isErrorFromBillingGroups: true });
    }
  }

  onSaveButtonClick = async () => {
    const { projectName, selectedBillingGroup, billingGroups } = this.state;
    const { onSuccess, setSelectedProject } = this.props;

    try {
      this.setState({ isSaveButtonDisabled: true });
      const { id } = await saveProject({
        projectName,
        selectedBillingGroup,
        billingGroups,
      });
      setSelectedProject(id);
      onSuccess();
      this.setState({
        projectName: '',
        addingProject: false,
      });
    } catch (error) {
      this.setState({ error });
    } finally {
      this.setState({ projectName: '', isSaveButtonDisabled: false });
    }
  };

  onProjectNameChange = e => {
    this.setState({ projectName: e.target.value });
  };

  onBillingGroupSelect = e => {
    this.setState({ selectedBillingGroup: e.target.value });
  };

  onCancelClick = () => {
    this.setState({ addingProject: false });
  };

  onCreateButtonClick = () => {
    this.setState({ addingProject: true });
  };

  onClickTryAgain = () => {
    this.setState({ ...defaultState });
  };
  render() {
    console.log('ok');
    const { theme } = this.props;
    const {
      error,
      addingProject,
      projectName,
      isSaveButtonDisabled,
      billingGroups,
      isErrorFromBillingGroups,
    } = this.state;
    if (error) {
      return (
        <Result
          style={{ width: '100%' }}
          status="error"
          title={getMsgFromErrorOrElse(error)}
          extra={
            !isErrorFromBillingGroups ? (
              <Button onClick={this.onClickTryAgain}>try again</Button>
            ) : null
          }
        />
      );
    } else if (addingProject) {
      return (
        <Container>
          <AddIcon width="15px" height="15px" fill={theme.tertiary} />
          <InputLabel>Create a project</InputLabel>
          <Input
            italic
            type="text"
            placeholder="Enter name of project"
            value={projectName}
            onChange={this.onProjectNameChange}
          />
          <Select onChange={this.onBillingGroupSelect}>
            {(billingGroups || []).map((bg, i) => (
              <option key={i} value={bg.id}>
                {bg.name}
              </option>
            ))}
          </Select>
          <TealActionButton disabled={isSaveButtonDisabled} onClick={this.onSaveButtonClick}>
            Save
          </TealActionButton>
          <WhiteButton onClick={this.onCancelClick}>Cancel</WhiteButton>
        </Container>
      );
    } else if (!addingProject) {
      return (
        <Container>
          <CreateButton onClick={this.onCreateButtonClick}>
            <AddIcon width="12px" height="12px" />
            Create a project
          </CreateButton>{' '}
        </Container>
      );
    }
    return null;
  }
}

export default enhance(CavaticaAddProject);
