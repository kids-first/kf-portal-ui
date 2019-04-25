import * as React from 'react';
import { compose, lifecycle, withState } from 'recompose';
import { injectState } from 'freactal';
import { withTheme } from 'emotion-theming';
import { css } from 'emotion';

import { cavaticaWebRoot } from 'common/injectGlobals';
import { FENCES } from 'common/constants';
import { Link, withRouter } from 'react-router-dom';
import ExternalLink from 'uikit/ExternalLink';
import RightArrows from 'react-icons/lib/fa/angle-double-right';
import CavaticaFileSummary from './CavaticaFileSummary';
import CavaticaProjects from './CavaticaProjects';
import { graphql } from 'services/arranger';
import { withApi } from 'services/api';

import { ModalFooter, ModalWarning } from 'components/Modal/index.js';

import { convertFenceUuids, copyFiles as copyCavaticaFiles } from 'services/cavatica';
import provideCavaticaFileAuthorizations from 'stateProviders/provideCavaticaFileAuthorizations';
import { trackUserInteraction, TRACKING_EVENTS } from 'services/analyticsTracking';

import { Paragraph } from 'uikit/Core';

const copyToProject = async ({ selectedFiles, selectedProject }) => {
  const promises = [];

  // Make a request to get cavaticaIds forEach repository, stick it in our promises list
  //  Don't do the async await in the forEach loop...
  Object.keys(selectedFiles).forEach(fence => {
    if (FENCES.includes(fence) && selectedFiles[fence] && selectedFiles[fence].length > 0) {
      // Convert KF_IDs to CavaticaIds
      const promise = convertFenceUuids({
        ids: selectedFiles[fence],
        fence: fence,
      }).then(response =>
        // Then Copy to Cavatica
        copyCavaticaFiles({
          project: selectedProject,
          ids: [...response.map(item => item.id)],
        }),
      );
      promises.push(promise);
    }
  });

  return await Promise.all(promises);
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
        href={`${cavaticaWebRoot}/u/${selectedProjectData.id}`}
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

const enhance = compose(
  provideCavaticaFileAuthorizations,
  injectState,
  withTheme,
  withRouter,
  withApi,
  withState('addingProject', 'setAddingProject', false),
  withState('selectedProjectData', 'setSelectedProjectData', null),
  withState('filesSelected', 'setFilesSelected', []),
  lifecycle({
    async componentDidMount() {
      const { fileIds, setFilesSelected, sqon, api } = this.props;
      let ids = fileIds;
      if (!ids || ids.length === 0) {
        ids = await graphql(api)({
          query: `query ($sqon: JSON){
              file {
                aggregations(filters: $sqon) {
                  kf_id {
                    buckets {
                      key
                    }
                  }
                }
              }
            }`,
          variables: {
            sqon,
          },
        }).then(({ data: { file: { aggregations: { kf_id: { buckets } } } } }) =>
          buckets.map(({ key }) => key),
        );
      }
      setFilesSelected(ids);
    },
  }),
);
const CavaticaCopyModal = ({
  state,
  effects: { unsetModal, setToast, closeToast },
  theme,
  addingProject,
  fileIds,
  filesSelected,
  setAddingProject,
  selectedProjectData,
  setSelectedProjectData,
  ...props
}) => {
  const unauthFilesWarning = state.unauthorizedFiles && state.unauthorizedFiles > 0;
  const hasFenceConnection = Object.keys(state.fenceConnections).length > 0;
  const isFilesSelected = filesSelected && filesSelected.length > 0;
  const showWarning = unauthFilesWarning || !hasFenceConnection;
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
              <br />
              You are attempting to copy files that you are not authorized to access.
            </span>
          )}
          {!hasFenceConnection && (
            <Paragraph>
              Please{' '}
              <Link to={`/user/${state.loggedInUser.egoId}#settings`} onClick={unsetModal}>
                connect to data repositories
              </Link>{' '}
              to lookup which files you are authorized to copy.
            </Paragraph>
          )}
        </ModalWarning>
      )}
      {hasFenceConnection && isFilesSelected && (
        <div className="content">
          <CavaticaFileSummary filesSelected={filesSelected} {...props} />
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
              const uuids = state.authorizedFilesCombined;
              await copyToProject({
                selectedProject: selectedProjectData.id,
                selectedFiles: state.authorizedFiles,
              });
              setToast({
                id: `${Date.now()}`,
                action: 'success',
                component: SuccessToastComponent({ theme, selectedProjectData }),
              });

              trackUserInteraction({
                category: TRACKING_EVENTS.categories.fileRepo.actionsSidebar,
                action: 'Copied Files to Cavatica Project',
                label: JSON.stringify({ files: uuids.length, uuids }),
              });
              props.onComplete();
            } catch (e) {
              //TODO: Display failure error.
              trackUserInteraction({
                category: TRACKING_EVENTS.categories.fileRepo.actionsSidebar,
                action: 'Copied Files to Cavatica Project FAILED',
                label: e.message ? e.message : null,
              });
            }
          },
          submitDisabled:
            //Disabled is inverse of enabled
            //Enabled if project selected AND (we have authorized files OR no gen3 connection but files are selected)
            !(
              selectedProjectData &&
              (state.authorizedFilesCombined.length > 0 || (!hasFenceConnection && isFilesSelected))
            ),
          submitText: hasFenceConnection
            ? `Copy ${
                state.authorizedFiles ? state.authorizedFilesCombined.length : 0
              } files`.toUpperCase()
            : `Copy Authorized`.toUpperCase(),
        }}
      />
    </div>
  );
};

export default enhance(CavaticaCopyModal);
