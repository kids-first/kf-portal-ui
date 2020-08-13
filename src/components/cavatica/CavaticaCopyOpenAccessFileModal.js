import * as React from 'react';
import { Alert, notification } from 'antd';
import { ModalFooter } from 'components/Modal/index.js';
import { TRACKING_EVENTS, trackUserInteraction } from 'services/analyticsTracking';
import { CavaticaSuccessNotificationContent } from './CavaticaSuccessNotificationContent';
import { copyToProject } from './api';
import CavaticaProjects from './CavaticaProjects';
import './cavatica.css';
import './CavaticaCopyMultipleFilesModal.css';
import PropTypes from 'prop-types';

class CavaticaCopyOpenAccessFileModal extends React.Component {
  propTypes = {
    fileId: PropTypes.string.isRequired,
    onComplete: PropTypes.func.isRequired,
    file: PropTypes.object.isRequired,
  };

  state = {
    addingProject: false,
    selectedProjectData: null,
    error: null,
  };

  render() {
    const { fileId, onComplete, file } = this.props;

    const { addingProject, selectedProjectData } = this.state;
    const { error } = this.state;

    return (
      <div className="copyModalRoot">
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
          <span className="cavatica-modalHeader">
            Select which Cavatica project you want to copy to:
          </span>
          <CavaticaProjects
            onAddProject={() => {
              this.setState({ addingProject: true });
            }}
            onSelectProject={(project) => {
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
                  this.setState({ error: new Error('This file has no repository information.') });
                  return;
                } else if (!latestDid) {
                  this.setState({ error: new Error('This file has no "latest_did" property.') });
                  return;
                }
                await copyToProject({
                  selectedProject: selectedProjectData.id,
                  selectedFiles: { [fence]: [latestDid] },
                });

                notification.success({
                  message: 'Success',
                  description: CavaticaSuccessNotificationContent({ selectedProjectData }),
                  duration: 10,
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

export default CavaticaCopyOpenAccessFileModal;
