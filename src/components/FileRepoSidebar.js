import React from 'react';
import styled, { css } from 'react-emotion';
import Spinner from 'react-spinkit';
import { injectState } from 'freactal';

import Button from '../uikit/Button';
import LoadingOnClick from './LoadingOnClick';
import CavaticaSidebar from 'components/cavatica/CavaticaSidebar.js';

import downloadIcon from '../assets/icon-download-white.svg';
import PillInputWithButton from '../uikit/PillInputWithButton';
import { ColumnsState } from '@arranger/components/dist/DataTable';
import InfoIcon from '../icons/InfoIcon';
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

const Heading = styled('div')`
  font-size: 18px;
  letter-spacing: 0.3px;
  color: #2b388f;
  margin-bottom: 15px;
  font-weight: 500;
`;

const FileRepoSidebar = ({ projectId, index, style, sqon, effects, ...props }) => (
  <div
    css={`
      ${styles.container} ${style};
    `}
  >
    <Heading>
      File Action <InfoIcon />
    </Heading>
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
      <Heading style={{ color: '#343434', fontSize: 14, marginBottom: 5 }}>File Manifests</Heading>
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
        graphqlField="participant"
        render={({ state }) => {
          return (
            <div>
              <Heading style={{ color: '#343434', fontSize: 14, marginBottom: 5 }}>Reports</Heading>
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
    <CavaticaSidebar {...props} />
  </div>
);

export default injectState(FileRepoSidebar);
