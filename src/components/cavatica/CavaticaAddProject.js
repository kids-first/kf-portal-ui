import React, { Component } from 'react';
import { Button, Result } from 'antd';
import PropTypes from 'prop-types';
import { compose, withState } from 'recompose';

import PlusIcon from 'icons/PlusCircleIcon';
import { getBillingGroups, saveProject } from 'services/cavatica';
import { TealActionButton, WhiteButton } from 'uikit/Button';
import Input from 'uikit/Input';
import Row from 'uikit/Row';
import Select from 'uikit/Select';
import { getMsgFromErrorOrElse } from 'utils';

import './CavaticaAddProject.css';

const enhance = compose(withState('billingGroup', 'selectBillingGroup', null));

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
      const project = await saveProject({
        projectName,
        selectedBillingGroup,
        billingGroups,
      });
      setSelectedProject(project);
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

  onProjectNameChange = (e) => {
    this.setState({ projectName: e.target.value });
  };

  onBillingGroupSelect = (e) => {
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
    }

    if (addingProject) {
      return (
        <Row className="cavaticaAddProject-container">
          <PlusIcon className="addIcon" width="15px" height="15px" fill="#009bb8" />
          <Row className="inputLabel">Create a project</Row>
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
        </Row>
      );
    } else if (!addingProject) {
      return (
        <Row className="cavaticaAddProject-container">
          <WhiteButton className="createButton" onClick={this.onCreateButtonClick}>
            <PlusIcon className="addIcon" width="12px" height="12px" />
            Create a project
          </WhiteButton>{' '}
        </Row>
      );
    }

    return null;
  }
}

CavaticaAddProject.propTypes = {
  onSuccess: PropTypes.func,
  setSelectedProject: PropTypes.func,
};

export default enhance(CavaticaAddProject);
