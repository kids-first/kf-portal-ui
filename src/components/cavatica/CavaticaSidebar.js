import * as React from 'react';
import { compose, withState } from 'recompose';

import { injectState } from 'freactal';
import { withTheme } from 'emotion-theming';
import { css } from 'emotion';

import { CAVATICA } from 'common/constants';
import { cavaticaWebRoot } from 'common/injectGlobals';
import CavaticaProjects from './CavaticaProjects';
import CavaticaConnectButton from './CavaticaConnectButton';
import CavaticaAddProject from './CavaticaAddProject';
import ExternalLink from 'uikit/ExternalLink';
import DoubleArrowRight from 'icons/DoubleChevronRightIcon';

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
    display: flex;
    flex-direction: column;
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

  .niceWhiteButton {
    border-radius: 19px;
    background-color: #ffffff;
    border: solid 1px #cacbcf;
    font-size: 11px;
    letter-spacing: 0.2px;
    color: ${theme.tertiary};
    padding: 5px 18px 5px 5px;
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: center;
    text-transform: uppercase;
    font-weight: bold;
    cursor: pointer;
  
    :disabled {
      cursor: default;
      color: ${theme.greyScale2}
      background-color: ${theme.greyScale5}
    }
  }
`;

const CavaticaSidebar = ({ state, theme, addingProject, setAddingProject, ...props }) => {
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

  return (
    <div>
      {content}
      <div css="padding:10px;">
        <ExternalLink href={cavaticaWebRoot}>
          Go to Cavatica{' '}
          <DoubleArrowRight fill={theme.primary} width="10px" css="margin-left:4px;" />
        </ExternalLink>
      </div>
    </div>
  );
};

export default enhance(CavaticaSidebar);
