import React from 'react';
import { compose, lifecycle, withState } from 'recompose';
import { injectState } from 'freactal';
import { withTheme } from 'emotion-theming';

import Column from 'uikit/Column';
import Row from 'uikit/Row';
import { WhiteButton, TealActionButton } from 'uikit/Button';
import Input from 'uikit/Input';
import { getBillingGroups, saveProject } from 'services/cavatica';
import LoadingOnClick from 'components/LoadingOnClick';
import { styleComponent } from 'components/Utils';

import { input, select } from '../../../theme/tempTheme.module.css';
import { styledLabel } from './CavaticaProjects.module.css';

const StyledLabel = styleComponent('label', styledLabel);

const enhance = compose(
  injectState,
  withTheme,
  withState('projectName', 'setProjectName', ''),
  withState('billingGroups', 'setBillingGroups', []),
  withState('billingGroup', 'selectBillingGroup', null),
  lifecycle({
    async componentDidMount() {
      const { setBillingGroups } = this.props;
      getBillingGroups().then(bg => setBillingGroups(bg));
    },
  }),
);

const Create = ({
  projectName,
  setProjectName,
  billingGroups,
  selectedBillingGroup,
  selectBillingGroup,
  onProjectCreated,
  onProjectCreationCancelled,
}) => {
  const onSaveButtonClick = () =>
    saveProject({
      projectName,
      selectedBillingGroup,
      billingGroups,
    }).then(({ id }) => {
      setProjectName('');
      onProjectCreated({ projectName, id });
    });
  const onCancelClick = data => onProjectCreationCancelled(data);
  const onProjectNameChange = e => setProjectName(e.target.value);
  const onBillingGroupSelect = e => selectBillingGroup(e.target.value);
  return (
    <Column>
      <StyledLabel>Project Name:</StyledLabel>
      <Input
        type="text"
        placeholder="Enter name of project"
        value={projectName}
        onChange={onProjectNameChange}
      />
      <StyledLabel>Billing Group:</StyledLabel>
      <select className={`${select} ${input}`} onChange={onBillingGroupSelect}>
        {billingGroups.map((bg, i) => (
          <option key={i} value={bg.id}>
            {bg.name}
          </option>
        ))}
      </select>
      <Row mt="20px" justifyContent="space-between">
        <WhiteButton
          onClick={() => {
            onCancelClick({ projectName });
          }}
        >
          Cancel
        </WhiteButton>
        <LoadingOnClick
          onClick={onSaveButtonClick}
          render={({ loading, onClick }) => (
            <TealActionButton onClick={onClick} disabled={loading}>
              Save
            </TealActionButton>
          )}
        />
      </Row>
    </Column>
  );
};

export default enhance(Create);
