import React from 'react';
import styled, { css } from 'react-emotion';
import Spinner from 'react-spinkit';
import { injectState } from 'freactal';

import Button from 'uikit/Button';
import Heading from 'uikit/Heading';
import LoadingOnClick from './LoadingOnClick';
import CavaticaExportWidget from 'components/cavatica/CavaticaExportWidget.js';

import downloadIcon from '../assets/icon-download-white.svg';
import PillInputWithButton from '../uikit/PillInputWithButton';
import { ColumnsState } from '@arranger/components/dist/DataTable';
import { downloadFileFromGen3 } from 'services/gen3';
import { GEN3 } from 'common/constants';
import { getFilesById } from 'services/arranger';

import {
  downloadBiospecimen,
  fileManifestParticipantsOnly,
  clinicalDataParticipants,
  clinicalDataFamily,
} from '../services/downloadData';
import FamilyManifestModal from './FamilyManifestModal';

const styles = {
  container: css`
    flex: none;
    width: 310px;
    background-color: #f4f5f8;
    box-shadow: 0 0 4.9px 0.2px #a0a0a3;
    border: solid 1px #c6c7cc;
    padding: 30px 5px 30px 15px;
  `,
};

const getGen3UUIDs = async arrangerIds => {
  const fileData = await getFilesById({ ids: arrangerIds, fields: ['uuid'] });
  return fileData.map(file => file.node.uuid);
};

const downloadFile = async (arrangerIds, gen3Key) => {
  let files = await getGen3UUIDs(arrangerIds);
  let fileUUID = files && files.length > 0 ? files[0] : null;
  if (!fileUUID) throw new Error('Error retrieving File ID for the selected Row.');
  return downloadFileFromGen3(gen3Key, fileUUID);
};
const DownloadIcon = ({ className, loading }) =>
  loading ? (
    <Spinner
      fadeIn="none"
      name="circle"
      color="#fff"
      style={{
        width: 15,
        height: 15,
        marginRight: 9,
      }}
    />
  ) : (
    <img
      alt=""
      src={downloadIcon}
      css={`
        width: 10px;
        margin-right: 9px;
        ${className};
      `}
    />
  );

const Divider = styled('div')`
  height: 1px;
  background-color: #d4d6dd;
  margin: 20px 10px 20px 0;
`;

const FileRepoSidebar = ({ state, projectId, index, style, sqon, effects, theme, ...props }) => {
  let gen3Key = state.integrationTokens[GEN3];
  let setToast = effects.setToast;
  return (
    <div
      css={`
        ${styles.container} ${style};
      `}
    >
      <Heading>Actions</Heading>
      <div
        css={`
          font-size: 14px;
        `}
      >
        If you have not selected any files, all files in your query will be included in the actions.
      </div>
      <Divider />
      <Heading>Download</Heading>
      <div>
        <Heading style={{ color: '#343434', fontSize: 14, marginBottom: 5 }}>
          File Manifests
        </Heading>
        <ColumnsState
          projectId={projectId}
          graphqlField="file"
          render={({ state }) => {
            return (
              <div
                css={`
                  display: flex;
                  margin-bottom: 13px;
                `}
              >
                <PillInputWithButton
                  options={{
                    'Participant only': fileManifestParticipantsOnly({
                      sqon,
                      columns: state.columns,
                    }),

                    'Participant and family': () => {
                      return effects.setModal({
                        title: 'Download Manifest (Participant and Family)',
                        component: (
                          <FamilyManifestModal
                            sqon={sqon}
                            index={index}
                            projectId={projectId}
                            columns={state.columns}
                          />
                        ),
                      });
                    },
                  }}
                  render={({ loading }) => {
                    return (
                      <React.Fragment>
                        <DownloadIcon loading={loading} />DOWNLOAD
                      </React.Fragment>
                    );
                  }}
                />
              </div>
            );
          }}
        />
        <ColumnsState
          projectId={projectId}
          graphqlField="file"
          render={({ state }) => {
            return (
              <div>
                <Heading style={{ color: '#343434', fontSize: 14, marginBottom: 5 }}>
                  Selected File
                </Heading>
                <div
                  css={`
                    display: flex;
                    margin-bottom: 13px;
                  `}
                >
                  <LoadingOnClick
                    onClick={() => {
                      downloadFile(props.selectedTableRows, gen3Key)
                        .then(url => {
                          let a = document.createElement('a');
                          console.log(url);
                          a.href = url;
                          a.download = url.split('/').slice(-1);
                          a.click();
                        })
                        .catch(err => {
                          setToast({
                            id: `${Date.now()}`,
                            action: 'success',
                            component: (
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
                                    Failed!
                                  </div>
                                  <div>Unable to download file</div>
                                  <div
                                    css={`
                                      color: 'red';
                                      margin-bottom: 20px;
                                      padding: 20px;
                                    `}
                                  >
                                    <span>
                                      Your account does not have the required permission to download
                                      this file.
                                    </span>
                                  </div>
                                </div>
                              </div>
                            ),
                          });
                        });
                    }}
                    render={({ onClick, loading, disabled }) => {
                      return (
                        <Button
                          css={`
                            flex-grow: inhert;
                            padding-left: 15px;
                          `}
                          disabled={props.selectedTableRows.length !== 1 || loading}
                          onClick={onClick}
                          loading={loading}
                        >
                          <DownloadIcon />DOWNLOAD
                        </Button>
                      );
                    }}
                  />
                </div>
              </div>
            );
          }}
        />
        <ColumnsState
          projectId={projectId}
          graphqlField="participant"
          render={({ state }) => {
            return (
              <div>
                <Heading style={{ color: '#343434', fontSize: 14, marginBottom: 5 }}>
                  Reports
                </Heading>
                <div
                  css={`
                    display: flex;
                    margin-bottom: 13px;
                  `}
                >
                  <PillInputWithButton
                    options={{
                      'Clinical (Participant)': clinicalDataParticipants({
                        sqon,
                        columns: state.columns,
                      }),
                      'Clinical (Family)': clinicalDataFamily({ sqon, columns: state.columns }),
                    }}
                    render={({ loading }) => {
                      return (
                        <React.Fragment>
                          <DownloadIcon loading={loading} />
                          DOWNLOAD
                        </React.Fragment>
                      );
                    }}
                  />
                </div>
                <LoadingOnClick
                  onClick={downloadBiospecimen({ sqon, columns: state.columns })}
                  render={({ onClick, loading, disabled }) => (
                    <Button
                      css={`
                        flex-grow: 1;
                        padding-left: 15px;
                      `}
                      disabled={disabled}
                      onClick={onClick}
                    >
                      <DownloadIcon loading={loading} />BIOSPECIMEN
                    </Button>
                  )}
                />
              </div>
            );
          }}
        />
      </div>
      <Divider />
      <Heading>Data Analysis</Heading>
      <CavaticaExportWidget {...props} />
    </div>
  );
};

export default injectState(FileRepoSidebar);
