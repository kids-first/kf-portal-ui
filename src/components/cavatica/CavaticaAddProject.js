import * as React from 'react';
import { compose, lifecycle, withState } from 'recompose';
import { withTheme } from 'emotion-theming';

import { css } from 'emotion';
import styled from 'react-emotion';
import { injectState } from 'freactal';

import { createProject, getBillingGroups } from 'services/cavatica';

import cavaticaLogo from 'assets/logomark-cavatica.svg';
import DoubleArrowLeft from 'icons/DoubleChevronLeftIcon';

const enhance = compose(injectState, withTheme, withState('projectName', 'setProjectName', ''));

const saveProject = async ({ projectName, onSuccess }) => {
  const billingGroups = await getBillingGroups();
  if (billingGroups && billingGroups.length > 0) {
    const groupId = billingGroups[0].id;

    createProject({ billing_group: groupId, name: projectName }).then(response => onSuccess());
  }
};

const CavaticaAddProject = ({ state, theme, projectName, setProjectName, ...props }) => {
  return (
    <div css={props.styles}>
      <div className="wrapper">
        <div className="header">
          <a
            css={`
              color: ${theme.primary};
              cursor: pointer;
            `}
            onClick={() => {
              if (typeof props.onClose === 'function') props.onClose();
            }}
          >
            <DoubleArrowLeft fill={theme.primary} width="10px" css="margin-left:4px;" /> back
          </a>
        </div>
        <div
          className="body"
          css={`
            padding: 15px;
            padding-top: 20px;
          `}
        >
          <div
            css={`
              color: ${theme.secondary};
              font-weight: bold;
              margin-bottom: 20px;
            `}
          >
            Create a new Cavatica Project
          </div>
          <div css={``}>Enter a name for your project:</div>
          <input
            className="textInput"
            type="text"
            placeholder="Project Name"
            value={projectName}
            onChange={e => setProjectName(e.target.value)}
          />
        </div>
        <div className="footer">
          <div
            css={`
              padding-top: 10px;
            `}
          >
            <a
              css={`
                color: ${theme.tertiary};
                cursor: pointer;
              `}
              onClick={() => {
                if (typeof props.onClose === 'function') props.onClose();
              }}
            >
              Cancel
            </a>
          </div>
          <div>
            <button
              css={theme.actionButton}
              onClick={() => {
                saveProject({ projectName, onSuccess: props.onSuccess });
              }}
            >
              Save
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default enhance(CavaticaAddProject);
