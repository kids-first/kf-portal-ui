import * as React from 'react';
import { compose, withState } from 'recompose';
import { withTheme } from 'emotion-theming';
import { withRouter } from 'react-router-dom';
import { withApi } from 'services/api';
import { ModalFooter } from 'components/Modal/index.js';
import { injectState } from 'freactal';
import { trackUserInteraction, TRACKING_EVENTS } from 'services/analyticsTracking';
import { SuccessToastComponent } from './CavaticaSuccessToast';
import { cssCopyModalRoot } from './css';
import { copyToProject } from './api';
import CavaticaProjects from './CavaticaProjects';

const enhance = compose(
  injectState,
  withTheme,
  withRouter,
  withApi,
  withState('addingProject', 'setAddingProject', false),
  withState('selectedProjectData', 'setSelectedProjectData', null),
);
const CavaticaCopyOpenAccessFileModal = ({
  effects: { setToast },
  theme,
  addingProject,
  fileId,
  setAddingProject,
  selectedProjectData,
  setSelectedProjectData,
  onComplete,
  ...props
}) => {
  return (
    <div css={cssCopyModalRoot(theme)}>
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
                selectedFiles: [fileId],
              });
              setToast({
                id: `${Date.now()}`,
                action: 'success',
                component: SuccessToastComponent({ theme, selectedProjectData }),
              });

              trackUserInteraction({
                category: TRACKING_EVENTS.categories.fileRepo.actionsSidebar,
                action: 'Copied File to Cavatica Project',
                label: JSON.stringify({ files: 1, uuids: [fileId] }),
              });
              onComplete();
            } catch (e) {
              //TODO: Display failure error.
              trackUserInteraction({
                category: TRACKING_EVENTS.categories.fileRepo.actionsSidebar,
                action: 'Copied File to Cavatica Project FAILED',
                label: e.message ? e.message : null,
              });
            }
          },
          submitDisabled: !selectedProjectData,
          submitText: `Copy Authorized`.toUpperCase(),
        }}
      />
    </div>
  );
};

export default enhance(CavaticaCopyOpenAccessFileModal);
