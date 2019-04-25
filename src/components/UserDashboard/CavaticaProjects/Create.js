import React from 'react';
import { compose, lifecycle, withState } from 'recompose';
import styled from 'react-emotion';
import { injectState } from 'freactal';
import { withTheme } from 'emotion-theming';

import LoadingOnClick from 'components/LoadingOnClick';

import Column from 'uikit/Column';
import Row from 'uikit/Row';
import { WhiteButton, TealActionButton } from 'uikit/Button';
import Input from 'uikit/Input';

import { getBillingGroups, saveProject } from 'services/cavatica';

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
      <BillingGroupSelect onChange={onBillingGroupSelect}>
        {billingGroups.map((bg, i) => (
          <option key={i} value={bg.id}>
            {bg.name}
          </option>
        ))}
      </BillingGroupSelect>

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
