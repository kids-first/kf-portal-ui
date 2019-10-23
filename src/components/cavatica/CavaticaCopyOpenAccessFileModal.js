import * as React from 'react';
import { compose } from 'recompose';
import { withTheme } from 'emotion-theming';

import { ModalFooter } from 'components/Modal/index.js';
import { injectState } from 'freactal';
import { trackUserInteraction, TRACKING_EVENTS } from 'services/analyticsTracking';
import { SuccessToastComponent } from './CavaticaSuccessToast';
import { cssCopyModalRoot } from './css';
import { copyToProject } from './api';
import CavaticaProjects from './CavaticaProjects';
import { Alert } from 'antd';

class CavaticaCopyOpenAccessFileModal extends React.Component {
  state = {
    addingProject: false,
    selectedProjectData: null,
    error: null,
  };
  render() {
    const {
      effects: { setToast },
      theme,
      fileId,
      onComplete,
      file,
    } = this.props;

    const { addingProject, selectedProjectData } = this.state;
    const { error } = this.state;
    return (
      <div css={cssCopyModalRoot(theme)}>
        {error && (
          <Alert
            message="Error"
            description="An error occured. Please try again or contact our support."
            type="error"
            closable
            showIcon
          />
        )}
        <div className="content">
          <span css={theme.modalHeader}>Select which Cavatica project you want to copy to:</span>
          <CavaticaProjects
            onAddProject={() => {
              this.setState({ addingProject: true });
            }}
            onSelectProject={project => {
              this.setState({ selectedProjectData: project });
            }}
            addingProject={addingProject}
          />
        </div>
        <ModalFooter
          {...{
            handleSubmit: async () => {
              const fence = file.repository;
              const latestDid = file.latest_did;
              try {
                if (!fence) {
                  throw new Error('This file has no repository information.');
                } else if (!latestDid) {
                  throw new Error('This file has no "latest_did" property.');
                }
                await copyToProject({
                  selectedProject: selectedProjectData.id,
                  selectedFiles: { [fence]: [latestDid] },
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
                trackUserInteraction({
                  category: TRACKING_EVENTS.categories.fileRepo.actionsSidebar,
                  action: 'Copied File to Cavatica Project FAILED',
                  label: e.message ? e.message : null,
                });
                console.error(e);
                this.setState({ error: e });
              }
            },
            submitDisabled: !selectedProjectData,
            submitText: `Copy Authorized`.toUpperCase(),
          }}
        />
      </div>
    );
  }
}

export default compose(
  injectState,
  withTheme,
)(CavaticaCopyOpenAccessFileModal);
