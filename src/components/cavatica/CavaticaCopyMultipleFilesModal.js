import React from 'react';
import { Link } from 'react-router-dom';
import { Alert, Button, Modal, notification, Spin, Typography } from 'antd';
import flatten from 'lodash/flatten';
import PropTypes from 'prop-types';

import { FENCES } from 'common/constants';
import { TRACKING_EVENTS, trackUserInteraction } from 'services/analyticsTracking';
import { graphql } from 'services/arranger';
import { getUserStudyPermission } from 'services/fileAccessControl';

import LoadingOnClick from '../LoadingOnClick';

import { copyToProject, isEveryFileTransferred, sumFilesTransfers } from './api';
import CavaticaFileSummary from './CavaticaFileSummary';
import CavaticaProjects from './CavaticaProjects';
import { CavaticaSuccessNotificationContent } from './CavaticaSuccessNotificationContent';

import './cavatica.css';
import './CavaticaCopyMultipleFilesModal.css';

const { Text, Paragraph } = Typography;

const shapeStudyAggs = (studyAggs = []) =>
  studyAggs
    .filter(({ files }) => files.length > 0)
    .map(({ id, files }) => ({
      id: id,
      count: files.length,
    }))
    .sort(({ count }, { count: nextCount }) => nextCount - count);

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
    isLoadingSelectedFilesSummary: false,
  };

  static propTypes = {
    api: PropTypes.func.isRequired,
    sqon: PropTypes.object,
    fileIds: PropTypes.arrayOf(PropTypes.string),
    onComplete: PropTypes.func.isRequired,
    onCancel: PropTypes.func.isRequired,
    fenceConnections: PropTypes.object,
    loggedInUser: PropTypes.object,
  };

  async componentDidMount() {
    const { fileIds, api, sqon, fenceConnections } = this.props;
    this.setState({ isLoadingSelectedFilesSummary: true });
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
    FENCES.forEach((fence) => {
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
      const promise = getUserStudyPermission(api, fenceConnections, fenceSqon).then((response) => {
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
      isLoadingSelectedFilesSummary: false,
    });
  }

  render() {
    const { onComplete, onCancel, loggedInUser, fenceConnections } = this.props;

    const {
      addingProject,
      selectedProjectData,
      authorizedFilesCombined,
      authorizedFiles,
      unauthorizedFiles,
      filesSelected,
      fileAuthInitialized,
      fileStudyData,
      isLoadingSelectedFilesSummary,
    } = this.state;

    const hasFenceConnection = Object.keys(fenceConnections).length > 0;
    const isFilesSelected = filesSelected && filesSelected.length > 0;
    const unauthFilesWarning = unauthorizedFiles && unauthorizedFiles.length > 0;
    return (
      <Modal
        title={`Copy File(s) to Cavatica Project`}
        width={'65%'}
        visible
        onCancel={onCancel}
        footer={[
          <Button key="cancel" onClick={onCancel}>
            Cancel
          </Button>,
          <LoadingOnClick
            onClick={async () => {
              try {
                const uuids = authorizedFilesCombined;
                const copyResults = await copyToProject({
                  selectedProject: selectedProjectData.id,
                  selectedFiles: authorizedFiles,
                });

                const failedResults = sumFilesTransfers(copyResults);
                const numOfIdsToBeCopied = failedResults.numOfIdsToBeCopied;
                const numOfIdsCopied = failedResults.numOfIdsCopied;
                if (!isEveryFileTransferred(numOfIdsToBeCopied, numOfIdsCopied)) {
                  notification.warn({
                    message: 'Copy to Cavatica',
                    description:
                      `Some files could not be copied` +
                      ` (${numOfIdsCopied} file(s) copied out of ${numOfIdsToBeCopied})`,
                    duration: 0,
                  });
                } else {
                  notification.success({
                    message: 'Success',
                    description: CavaticaSuccessNotificationContent({ selectedProjectData }),
                    duration: 10,
                  });
                }

                await trackUserInteraction({
                  category: TRACKING_EVENTS.categories.fileRepo.actionsSidebar,
                  action: 'Copied Files to Cavatica Project',
                  label: JSON.stringify({ files: uuids.length, uuids }),
                });
              } catch (e) {
                await trackUserInteraction({
                  category: TRACKING_EVENTS.categories.fileRepo.actionsSidebar,
                  action: 'Copied Files to Cavatica Project FAILED',
                  label: e.message ? e.message : null,
                });
                console.error(e);
                notification.error({
                  message: 'Error',
                  description: 'An error occurred. Please try again or contact our support.',
                  duration: 0,
                });
              } finally {
                onComplete();
              }
            }}
            key={'submit'}
            render={({ onClick, loading }) => (
              <Button
                loading={loading || isLoadingSelectedFilesSummary}
                onClick={onClick}
                disabled={
                  !(selectedProjectData && authorizedFilesCombined.length > 0) ||
                  isLoadingSelectedFilesSummary
                }
              >
                {hasFenceConnection
                  ? `Copy ${authorizedFiles ? authorizedFilesCombined.length : 0} Files`
                  : `Copy Authorized`}
              </Button>
            )}
          />,
        ]}
      >
        <>
          {unauthFilesWarning && (
            <Alert
              message="Access Error"
              description={
                <>
                  <Text>
                    {' '}
                    You are attempting to copy files that you are not authorized to access.
                  </Text>
                  {!hasFenceConnection && (
                    <Paragraph>
                      Please{' '}
                      <Link to={`/user/${loggedInUser.egoId}#settings`} onClick={onCancel}>
                        connect to data repositories
                      </Link>{' '}
                      to lookup which files you are authorized to copy.
                    </Paragraph>
                  )}
                </>
              }
              type="error"
            />
          )}
          {isFilesSelected && isLoadingSelectedFilesSummary ? (
            <Spin />
          ) : (
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
              onSelectProject={(project) => {
                this.setState({ selectedProjectData: project });
              }}
              addingProject={addingProject}
            />
          </div>
        </>
      </Modal>
    );
  }
}

export default CavaticaCopyMultipleFilesModal;
