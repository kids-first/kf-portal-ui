import React from 'react';
import { compose } from 'recompose';
import { injectState } from 'freactal';

import Column from 'uikit/Column';
import Row from 'uikit/Row';
import { WhiteButton, TealActionButton } from 'uikit/Button';
import Input from 'uikit/Input';
import { getBillingGroups, saveProject } from 'services/cavatica';

import { Result, Button } from 'antd';
import { getMsgFromErrorOrElse } from 'utils';

import { styleComponent } from 'components/Utils';

import { input, select } from '../../../theme/tempTheme.module.css';
import './CavaticaProjects.css';

const StyledLabel = styleComponent('label', 'CavaticaStyledLabel');

const defaultState = {
  projectName: '',
  billingGroups: [],
  selectedBillingGroup: null,
  error: null,
  isSaveButtonDisabled: false,
  //Do not show 'try again' if getBillingGroups fails. To show it, we should add a key to the component and change it to refresh the component. The parent is a bit too complicated to add extra logic to it so I prefer to make things simple...
  isErrorFromBillingGroups: false,
};

class Create extends React.Component {
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
    const { onProjectCreated } = this.props;

    try {
      this.setState({ isSaveButtonDisabled: true });
      const { id } = await saveProject({
        projectName,
        selectedBillingGroup,
        billingGroups,
      });
      onProjectCreated({ projectName, id });
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

  onClickTryAgain = () => {
    this.setState({ ...defaultState });
  };
  onCancelClick = data => () => this.props.onProjectCreationCancelled(data);

  render() {
    const {
      error,
      projectName,
      billingGroups,
      isSaveButtonDisabled,
      isErrorFromBillingGroups,
    } = this.state;
    if (error) {
      return (
        <Result
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
    return (
      <Column>
        <StyledLabel>Project Name:</StyledLabel>
        <Input
          type="text"
          placeholder="Enter name of project"
          value={projectName}
          onChange={this.onProjectNameChange}
        />
        <StyledLabel>Billing Group:</StyledLabel>
        <select className={`${select} ${input}`} onChange={this.onBillingGroupSelect}>
          {(billingGroups || []).map((bg, i) => (
            <option key={i} value={bg.id}>
              {bg.name}
            </option>
          ))}
        </select>
        <Row mt="20px" justifyContent="space-between">
          <WhiteButton onClick={this.onCancelClick({ projectName })}>Cancel</WhiteButton>
          <TealActionButton onClick={this.onSaveButtonClick} disabled={isSaveButtonDisabled}>
            Save
          </TealActionButton>
        </Row>
      </Column>
    );
  }
}

export default compose(injectState)(Create);
