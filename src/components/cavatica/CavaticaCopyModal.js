import * as React from 'react';
import { compose, withState } from 'recompose';
import { injectState } from 'freactal';
import { withTheme } from 'emotion-theming';
import { css } from 'emotion';

import { GEN3 } from 'common/constants';
import { Link, withRouter } from 'react-router-dom';
import ExternalLink from 'uikit/ExternalLink';
import RightArrows from 'react-icons/lib/fa/angle-double-right';
import CavaticaFileSummary from './CavaticaFileSummary';
import CavaticaProjects from './CavaticaProjects';

import { ModalFooter, ModalWarning } from 'components/Modal/index.js';

import { convertGen3FileIds, copyFiles as copyCavaticaFiles } from 'services/cavatica';
import provideGen3FileAuthorizations from 'stateProviders/provideGen3FileAuthorizations';

const enhance = compose(
  provideGen3FileAuthorizations,
  injectState,
  withTheme,
  withRouter,
  withState('addingProject', 'setAddingProject', false),
  withState('selectedProjectData', 'setSelectedProjectData', null),
);

const copyToProject = async ({ selectedFiles, selectedProject }) => {
  // Convert Gen3 UUIDs to CavaticaIds
  const conversionResponse = await convertGen3FileIds({ ids: selectedFiles });
  const cavaticaIds = conversionResponse.map(item => item.id);

  // Copy Files
  return await copyCavaticaFiles({
    project: selectedProject,
    ids: cavaticaIds,
  });
};

const SuccessToastComponent = ({ theme, selectedProjectData }) => (
  <div
    css={`
      display: flex;
    `}
  >
    <div
      css={`
        display: flex;
        flex-direction: column;
      `}
    >
      <div
        css={`
          font-size: 16px;
        `}
      >
        Success!
      </div>
      <div>Files were copied to your Cavatica project:</div>
      <div
        css={`
          color: ${theme.secondary};
          margin-bottom: 20px;
        `}
      >
        {selectedProjectData.name}
      </div>
      <ExternalLink
        css={`
          font-size: 14px;
        `}
        href={`https://kids-first-vayu.sbgenomics.com/u/${selectedProjectData.id}`}
      >
        Open project in Cavatica
        <RightArrows fill={theme.primary} width="10px" css="margin-left:4px;" />
      </ExternalLink>
    </div>
  </div>
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

div.verticalCenter {
  display:flex;
  flex-direction:vertical:
  align-items:center;
}

div.content {
  margin: 1em 0em;
  ${theme.column}
}

}
`;

const CavaticaCopyModal = ({
  state,
  effects: { unsetModal, setToast, closeToast },
  theme,
  addingProject,
  setAddingProject,
  selectedProjectData,
  setSelectedProjectData,
  ...props
}) => {
  const unauthFilesWarning = state.unauthorizedFiles && state.unauthorizedFiles > 0;
  const gen3Connected = true && state.integrationTokens[GEN3];
  const filesSelected = props.selectedTableRows && props.selectedTableRows.length > 0;
  const showWarning = unauthFilesWarning || !gen3Connected;
  return (
    <div css={styles(theme)}>
      {showWarning && (
        <ModalWarning>
          <span
            css={`
              font-size: 16px;
              font-weight: 500;
            `}
          >
            Access Error
          </span>
          {unauthFilesWarning && (
            <span>
              <br />You are attempting to copy files that you are not authorized to access.
            </span>
          )}
          {!gen3Connected && (
            <span>
              <br />Please{' '}
              <Link to={`/user/${state.loggedInUser.egoId}#settings`} onClick={unsetModal}>
                connect to GEN3
              </Link>{' '}
              to lookup which files you are authorized to copy.
            </span>
          )}
        </ModalWarning>
      )}
      {!filesSelected && <ModalWarning>No files selected.</ModalWarning>}
      {gen3Connected &&
        filesSelected && (
          <div className="content">
            <CavaticaFileSummary {...props} />
          </div>
        )}
      <div className="content">
        <span css={theme.modalHeader}>Select which Cavatica project you want to copy to:</span>
        <CavaticaProjects
          onAddProject={() => {
            setAddingProject(true);
          }}
          onSelectProject={project => {
            setSelectedProjectData(project);
          }}
          {...props}
        />
      </div>
      <ModalFooter
        {...{
          handleSubmit: async () => {
            try {
              await copyToProject({
                selectedProject: selectedProjectData.id,
                selectedFiles: state.authorizedFiles,
              });
              setToast({
                id: `${Date.now()}`,
                action: 'success',
                component: SuccessToastComponent({ theme, selectedProjectData }),
              });
              props.onComplete();
            } catch (e) {
              //TODO: Display failure error.
            }
          },
          submitDisabled:
            //Disabled is inverse of enabled
            //Enabled if project selected AND (we have authorized files OR no gen3 connection but files are selected)
            !(
              selectedProjectData &&
              ((state.authorizedFiles && state.authorizedFiles.length > 0) ||
                (!gen3Connected && filesSelected))
            ),
          submitText: gen3Connected
            ? `Copy ${state.authorizedFiles ? state.authorizedFiles.length : 0} files`.toUpperCase()
            : `Copy Authorized`.toUpperCase(),
        }}
      />
    </div>
  );
};

export default enhance(CavaticaCopyModal);
