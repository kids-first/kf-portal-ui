import * as React from 'react';
import { compose, withState } from 'recompose';
import { withTheme } from 'emotion-theming';
import { css } from 'react-emotion';

import { injectState } from 'freactal';

import { createProject, getBillingGroups } from 'services/cavatica';
import LoadingOnClick from 'components/LoadingOnClick';

import PlusIcon from 'icons/PlusCircleIcon';

const enhance = compose(
  injectState,
  withTheme,
  withState('projectName', 'setProjectName', ''),
  withState('addingProject', 'setAddingProject', false),
);

const saveProject = async ({ projectName, onSuccess }) => {
  const billingGroups = await getBillingGroups();
  if (billingGroups && billingGroups.length > 0) {
    const groupId = billingGroups[0].id;

    createProject({ billing_group: groupId, name: projectName }).then(response => onSuccess());
  }
};

const styles = theme => css`
  ${theme.row};

  .inputLabel {
    font-size:12px;
    line-height:2.39
    color: ${theme.tertiary};
    text-transform: uppercase;
  }

  .projectNameInput {
    font-size: 12px;
    font-style: italic;
    margin-left: 10px;
  }

  .saveButton {
    ${theme.actionButton};
    font-size: 11px;
    line-height: 2.36;
    letter-spacing: 0.2px;
    text-transform: uppercase;
  }

  .cancelText {
    font-size:12px;
    color: ${theme.tertiary};
    cursor: pointer;
  }
`;
const CavaticaAddProject = ({
  state,
  theme,
  projectName,
  setProjectName,
  addingProject,
  setAddingProject,
  ...props
}) => {
  return (
    <div css={styles(theme)}>
      {addingProject ? (
        <div css={theme.row}>
          <PlusIcon
            width={12}
            height={12}
            fill={theme.tertiary}
            css={`
              margin-top: 1px;
              margin-right: 4px;
            `}
          />
          <div className="inputLabel">Create a project</div>
          <input
            className="projectNameInput"
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
              <button className="saveButton" disabled={loading} onClick={onClick}>
                <span>Save</span>
              </button>
            )}
          />
          <a className="cancelText" onClick={() => setAddingProject(false)}>
            Cancel
          </a>
        </div>
      ) : (
        <button
          onClick={() => setAddingProject(true)}
          css={`
            text-transform: uppercase;
            font-size: 11.5px;
            font-weight: normal;
            color: ${theme.tertiary};
            border-radius: 19px;
            border: solid 1px ${theme.greyScale10};
            padding: 10px;
            ${theme.row};
            cursor: pointer;
          `}
        >
          <PlusIcon
            width={12}
            height={12}
            fill={theme.tertiary}
            css={`
              margin-top: 1px;
              margin-right: 4px;
            `}
          />
          <div>Create a project</div>
        </button>
      )}
    </div>
  );
};

export default enhance(CavaticaAddProject);
