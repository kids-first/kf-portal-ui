import * as React from 'react';
import { compose, lifecycle, withState } from 'recompose';
import { injectState } from 'freactal';
import { withTheme } from 'emotion-theming';
import { withRouter } from 'react-router-dom';
import { graphql } from 'services/arranger';
import { withApi } from 'services/api';
import { ModalFooter } from 'components/Modal/index.js';
import provideCavaticaFileAuthorizations from 'stateProviders/provideCavaticaFileAuthorizations';
import { trackUserInteraction, TRACKING_EVENTS } from 'services/analyticsTracking';
import { SuccessToastComponent } from './CavaticaSuccessToast';
import { cssCopyModalRoot } from './css';
import { copyToProject } from './api';
import CavaticaProjects from './CavaticaProjects';
import { Link } from 'react-router-dom';
import CavaticaFileSummary from './CavaticaFileSummary';
import { ModalWarning } from 'components/Modal/index.js';
import { Paragraph } from 'uikit/Core';

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
const CavaticaCopyMultipleFilesModal = ({
  state,
  effects,
  theme,
  addingProject,
  fileIds,
  filesSelected,
  setAddingProject,
  selectedProjectData,
  setSelectedProjectData,
  onComplete,
  ...props
}) => {
  const hasFenceConnection = Object.keys(state.fenceConnections).length > 0;
  const isFilesSelected = filesSelected && filesSelected.length > 0;
  const unauthFilesWarning = state.unauthorizedFiles && state.unauthorizedFiles.length > 0;
  return (
    <div css={cssCopyModalRoot(theme)}>
      {unauthFilesWarning && (
        <ModalWarning>
          <span
            css={`
              font-size: 16px;
              font-weight: 500;
            `}
          >
            Access Error
          </span>
          <span>
            <br />
            You are attempting to copy files that you are not authorized to access.
          </span>
          {!hasFenceConnection && (
            <Paragraph>
              Please{' '}
              <Link to={`/user/${state.loggedInUser.egoId}#settings`} onClick={effects.unsetModal}>
                connect to data repositories
              </Link>{' '}
              to lookup which files you are authorized to copy.
            </Paragraph>
          )}
        </ModalWarning>
      )}
      {hasFenceConnection && isFilesSelected && (
        <div className="content">
          <CavaticaFileSummary sqon={props.sqon} api={props.api} />
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
              effects.setToast({
                id: `${Date.now()}`,
                action: 'success',
                component: SuccessToastComponent({ theme, selectedProjectData }),
              });

              trackUserInteraction({
                category: TRACKING_EVENTS.categories.fileRepo.actionsSidebar,
                action: 'Copied Files to Cavatica Project',
                label: JSON.stringify({ files: uuids.length, uuids }),
              });
              onComplete();
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

export default enhance(CavaticaCopyMultipleFilesModal);
