import React from 'react';
import styled, { css } from 'react-emotion';
import Spinner from 'react-spinkit';

import Button from '../uikit/Button';
import LoadingOnClick from './LoadingOnClick';

import cavaticaLogo from '../assets/logomark-cavatica.svg';
import downloadIcon from '../assets/icon-download-white.svg';
import PillInputWithButton from '../uikit/PillInputWithButton';
import { ColumnsState } from '@arranger/components/dist/DataTable';
import InfoIcon from '../icons/InfoIcon';
import {
  downloadBiospecimen,
  fileManifestParticipantsOnly,
  fileManifestParticipantsAndFamily,
  clinicalDataParticipants,
  clinicalDataFamily,
} from '../services/downloadData';

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

const Divider = styled('div') `
  height: 1px;
  background-color: #d4d6dd;
  margin: 20px 10px 20px 0;
`;

const Heading = styled('div') `
  font-size: 14px;
  letter-spacing: 0.3px;
  color: #2b388f;
  margin-bottom: 8px;
  font-weight: 500;
`;

export default ({ projectId, style, sqon, ...props }) => (
  <div
    css={`
      ${styles.container} ${style};
    `}
  >
    <Heading
      css={`
        font-size: 18px;
        margin-bottom: 15px;
      `}
    >
      File Action <InfoIcon />
    </Heading>
    <div
      css={`
        font-size: 14px;
        margin-bottom: 30px;
      `}
    >
      If you have not selected any files, all files in your query will be included in the actions.
    </div>
    <Heading>Download</Heading>
    <div>
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
                  'Participant and family': fileManifestParticipantsAndFamily({
                    sqon,
                    columns: state.columns,
                  }),
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
              <Heading>Reports</Heading>
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
                    disabled={disabled || loading}
                    onClick={onClick}
                    loading={loading}
                  >
                    <DownloadIcon />BIOSPECIMEN
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
    <button
      css={`
        border-radius: 19px;
        background-color: #ffffff;
        border: solid 1px #cacbcf;
        font-size: 11px;
        letter-spacing: 0.2px;
        color: #008199;
        padding: 5px 18px 5px 5px;
        display: flex;
        align-items: center;
      `}
    >
      <img
        alt=""
        src={cavaticaLogo}
        css={`
          width: 28px;
          margin-right: 7px;
        `}
      />Export files to Cavatica
    </button>
  </div>
);
