import * as React from 'react';
import { compose, withState } from 'recompose';

import { injectState } from 'freactal';
import { withTheme } from 'emotion-theming';
import { css } from 'emotion';

import { CAVATICA } from 'common/constants';
import CavaticaProjects from './CavaticaProjects';
import CavaticaConnectButton from './CavaticaConnectButton';
import CavaticaAddProject from './CavaticaAddProject';

const enhance = compose(
  injectState,
  withTheme,
  withState('addingProject', 'setAddingProject', false),
);

const styles = theme => css`
  .wrapper {
    border-radius: 10px;
    background-color: #ffffff;
    border: solid 1px #cacbcf;

    input:focus,
    select:focus,
    textarea:focus,
    button:focus {
      outline: none;
    }
  }

  .header {
    display: flex;
    padding: 5px;
    border-bottom: solid 1px #cacbcf;
    justify-content: space-between;
  }

  .body {
    border-bottom: solid 1px #cacbcf;
  }

  .textInput {
    border-radius: 10px;
    background-color: #ffffff;
    border: solid 1px #cacbcf;
    padding: 5px;
    font-size: 1em;
    margin: 10px;
    margin-bottom: 0px;
  }

  .footer {
    padding: 10px;
    display:flex;
    justify-content:space-between;
  }

  div.verticalCenter {
    display:flex;
    flex-direction:vertical:
    align-items:center;
  }
`;

const CavaticaExportWidget = ({ state, theme, addingProject, setAddingProject, ...props }) => {
  let content = <CavaticaConnectButton styles={styles(theme)} />;
  if (state.integrationTokens[CAVATICA]) {
    if (addingProject) {
      content = (
        <CavaticaAddProject
          styles={styles(theme)}
          onSuccess={() => {
            // Fetch new Projects
            setAddingProject(false);
          }}
          onClose={() => {
            setAddingProject(false);
          }}
        />
      );
    } else {
      content = (
        <CavaticaProjects
          styles={styles(theme)}
          onAddProject={() => {
            setAddingProject(true);
          }}
          projects={[]}
          {...props}
        />
      );
    }
  }

  return <div>{content}</div>;
};

export default enhance(CavaticaExportWidget);
