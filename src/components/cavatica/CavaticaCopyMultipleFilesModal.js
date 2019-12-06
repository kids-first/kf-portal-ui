import * as React from 'react';
import { compose } from 'recompose';
import { injectState } from 'freactal';
import { withRouter } from 'react-router-dom';
import { graphql } from 'services/arranger';
import { withApi } from 'services/api';
import { ModalFooter } from 'components/Modal/index.js';
import { trackUserInteraction, TRACKING_EVENTS } from 'services/analyticsTracking';
import { SuccessToastComponent } from './CavaticaSuccessToast';
import { copyToProject } from './api';
import CavaticaProjects from './CavaticaProjects';
import { Link } from 'react-router-dom';
import CavaticaFileSummary from './CavaticaFileSummary';
import { ModalWarning } from 'components/Modal/index.js';
import { Paragraph } from 'uikit/Core';
import { getUserStudyPermission } from 'services/fileAccessControl';
import flatten from 'lodash/flatten';
import { FENCES } from 'common/constants';
import { Alert } from 'antd';

import './cavatica.css';
import './CavaticaCopyMultipleFilesModal.css';

const shapeStudyAggs = (studyAggs = []) =>
  studyAggs
    .filter(({ files }) => files.length > 0)
    .map(({ id, files }) => ({
      id: id,
      count: files.length,
    }))
    .sort(({ count }, { count: nextCount }) => nextCount - count);

const enhance = compose(injectState, withRouter, withApi);

const getSqonOrDefault = (
  sqon,
  defaultVal = {
    op: 'and',
    content: [],
  },
) => sqon || defaultVal;

class CavaticaCopyMultipleFilesModal extends React.Component {
  state = {
    addingProject: false,
    selectedProjectData: null,
    filesSelected: [],
    authorizedFiles: {},
    unauthorizedFiles: [],
    fileStudyData: {},
    fileAuthInitialized: false,
    authorizedFilesCombined: [],
    error: null,
  };

  async componentDidMount() {
    const {
      fileIds,
      api,
      state: { fenceConnections },
      sqon,
    } = this.props;

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

    // Get the Study Permission breakdown directly for FileStudyData and UnauthorizedFiles
    const { acceptedStudiesAggs, unacceptedStudiesAggs } = await getUserStudyPermission(
      api,
      fenceConnections,
      getSqonOrDefault(sqon),
    );
    // Authorized files needs to be broken down by repository, so lets dig deeper
    const authFiles = {};
    const fencePromises = [];
    FENCES.forEach(fence => {
      const fenceSqon = {
        op: 'and',
        content: [
          getSqonOrDefault(sqon),
          {
            op: 'in',
            content: {
              field: 'repository',
              value: [fence],
            },
          },
        ],
      };
      const promise = getUserStudyPermission(api, fenceConnections, fenceSqon).then(response => {
        authFiles[fence] = response.acceptedStudiesAggs
          .reduce((acc, study) => [...acc, ...study.files], [])
          .map(({ key }) => key);
        return true;
      });

      fencePromises.push(promise);
    });

    await Promise.all(fencePromises);

    this.setState({
      fileStudyData: {
        authorized: shapeStudyAggs(acceptedStudiesAggs),
        unauthorized: shapeStudyAggs(unacceptedStudiesAggs),
        names: [...acceptedStudiesAggs, ...unacceptedStudiesAggs].reduce(
          (acc, { id, studyName }) => ({
            ...acc,
            [id]: studyName,
          }),
          {},
        ),
      },
      unauthorizedFiles: unacceptedStudiesAggs
        .reduce((acc, study) => [...acc, ...study.files], [])
        .map(({ key }) => key),
      authorizedFiles: { ...authFiles },
      fileAuthInitialized: true,
      authorizedFilesCombined: flatten(Object.values({ ...authFiles })),
      filesSelected: ids,
    });
  }

  render() {
    const {
      state,
      effects: { unsetModal, setToast },
      onComplete,
    } = this.props;

    const {
      addingProject,
      selectedProjectData,
      authorizedFilesCombined,
      authorizedFiles,
      unauthorizedFiles,
      filesSelected,
      fileAuthInitialized,
      fileStudyData,
    } = this.state;

    const hasFenceConnection = Object.keys(state.fenceConnections).length > 0;
    const isFilesSelected = filesSelected && filesSelected.length > 0;
    const unauthFilesWarning = unauthorizedFiles && unauthorizedFiles.length > 0;
    const { error } = this.state;
    return (
      <div className="copyModalRoot">
        {error && (
          <Alert
            message="Error"
            description="An error occurred. Please try again or contact our support."
            type="error"
            closable
            showIcon
          />
        )}
        {unauthFilesWarning && (
          <ModalWarning>
            <span style={{ fontSize: '16px', fontWeight: '500' }}>Access Error</span>
            <span>
              <br />
              You are attempting to copy files that you are not authorized to access.
            </span>
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
        {isFilesSelected && (
          <div className="content">
            <CavaticaFileSummary
              {...{
                unauthorizedFiles,
                authorizedFiles,
                fileAuthInitialized,
                authorizedFilesCombined,
                fileStudyData,
              }}
            />
          </div>
        )}
        <div className="content">
          <span className="cavatica-modalHeader">
            Select which Cavatica project you want to copy to:
          </span>
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
              try {
                const uuids = authorizedFilesCombined;
                await copyToProject({
                  selectedProject: selectedProjectData.id,
                  selectedFiles: authorizedFiles,
                });
                setToast({
                  id: `${Date.now()}`,
                  action: 'success',
                  component: SuccessToastComponent({ selectedProjectData }),
                });

                trackUserInteraction({
                  category: TRACKING_EVENTS.categories.fileRepo.actionsSidebar,
                  action: 'Copied Files to Cavatica Project',
                  label: JSON.stringify({ files: uuids.length, uuids }),
                });
                onComplete();
              } catch (e) {
                trackUserInteraction({
                  category: TRACKING_EVENTS.categories.fileRepo.actionsSidebar,
                  action: 'Copied Files to Cavatica Project FAILED',
                  label: e.message ? e.message : null,
                });
                console.error(e);
                this.setState({ error: e });
              }
            },
            submitDisabled: !(selectedProjectData && authorizedFilesCombined.length > 0),
            submitText: hasFenceConnection
              ? `Copy ${authorizedFiles ? authorizedFilesCombined.length : 0} files`.toUpperCase()
              : `Copy Authorized`.toUpperCase(),
          }}
        />
      </div>
    );
  }
}

export default enhance(CavaticaCopyMultipleFilesModal);
