import React, { Fragment } from 'react';
import styled, { css } from 'react-emotion';
import { compose, withState } from 'recompose';
import { withTheme } from 'emotion-theming';
import { injectState } from 'freactal';
import { Trans } from 'react-i18next';

import downloadIcon from 'assets/icon-download-white.svg';
import IconWithLoading from 'icons/IconWithLoading';
import LeftChevron from 'icons/DoubleChevronLeftIcon';
import RightChevron from 'icons/DoubleChevronRightIcon';
import Button from 'uikit/Button';
import Heading from 'uikit/Heading';
import LoadingOnClick from '../LoadingOnClick';
import CavaticaCopyButton from 'components/cavatica/CavaticaCopyButton';
import { withApi } from 'services/api';

import { ColumnsState } from '@arranger/components/dist/DataTable';
import { downloadFileFromGen3 } from 'services/gen3';
import { GEN3 } from 'common/constants';
import { getFilesById } from 'services/arranger';
import { trackUserInteraction, TRACKING_EVENTS } from 'services/analyticsTracking';

import FileManifestsDownloadInput, { DownloadButton } from './FileManifestsDownloadInput';
import Subsection from './Subsection';
import ReportsDownloadInput from './ReportsDownloadInput';

const styles = ({ containerWidth, contentSidePadding, expanded, theme }) => ({
  container: css`
    overflow-y: auto;
    background-color: #f4f5f8;
    box-shadow: 0 0 4.9px 0.2px #a0a0a3;
    border: solid 1px #c6c7cc;
    flex-grow: 0;
    flex-shrink: 1;
    width: ${containerWidth + contentSidePadding * 2}px;
    min-width: 265px;
    height: 100%;
  `,
  titleBar: css`
    background-color: ${theme.greyScale5};
    margin: 0px;
    display: flex;
    padding-top: 15px;
    padding-left: 15px;
    cursor: pointer;
  `,
  content: css`
    padding-left: ${expanded ? contentSidePadding : contentSidePadding * 10}px;
    overflow: hidden;
    padding-right: ${contentSidePadding}px;
    transition: all 0.25s;
    padding-top: 10px;
  `,
});

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

const Divider = styled('div')`
  height: 1px;
  background-color: #d4d6dd;
  margin: 20px 0px;
`;

const SlidablePanel = ({ expanded, containerWidth, contentSidePadding, ...rest }) => {
  return (
    <div
      className={css`
        position: relative;
        transition: all 0.25s;
        width: ${expanded ? `${containerWidth + contentSidePadding * 2}px` : '40px'};
      `}
      {...rest}
    />
  );
};

const FileRepoSidebar = compose(
  injectState,
  withTheme,
  withApi,
  withState('expanded', 'setExpanded', true),
)(
  ({
    state,
    projectId,
    index,
    style,
    sqon,
    effects,
    theme,
    api,
    expanded,
    setExpanded,
    ...props
  }) => {
    let gen3Key = state.integrationTokens[GEN3];
    let setToast = effects.setToast;
    const containerWidth = 310;
    const contentSidePadding = 15;
    const panelStyle = styles({ containerWidth, contentSidePadding, theme, expanded });
    return (
      <SlidablePanel {...{ contentSidePadding, containerWidth, expanded }}>
        <div
          css={`
            ${panelStyle.container} ${style};
          `}
        >
          <div className={panelStyle.titleBar} onClick={() => setExpanded(!expanded)}>
            <Heading>
              <span
                className={css`
                  margin-right: 10px;
                `}
              >
                {' '}
                {expanded ? (
                  <RightChevron width={14} fill={theme.secondary} />
                ) : (
                  <LeftChevron width={14} fill={theme.secondary} />
                )}{' '}
              </span>
              <Trans>Actions</Trans>
            </Heading>
          </div>
          <div className={panelStyle.content}>
            <div
              css={`
                font-size: 14px;
                line-height: 26px;
              `}
            >
              <Trans i18nKey="fileRepoSidebar.noneSelected">
                If you have not selected any files, all files in your query will be included in the
                actions.
              </Trans>
            </div>
            <Divider />
            <Heading>
              <Trans>Download</Trans>
            </Heading>
            <div>
              <Subsection heading={<Trans>File Manifests</Trans>}>
                <FileManifestsDownloadInput
                  {...{
                    api,
                    sqon,
                    index,
                    projectId,
                    theme,
                    effects,
                  }}
                />
              </Subsection>
              <ColumnsState
                projectId={projectId}
                graphqlField="file"
                render={({ state }) => {
                  return (
                    <Subsection heading={<Trans>Selected File</Trans>}>
                      <LoadingOnClick
                        onClick={() => {
                          downloadFile(props.selectedTableRows, gen3Key)
                            .then(url => {
                              let a = document.createElement('a');
                              a.href = url;
                              trackUserInteraction({
                                category: TRACKING_EVENTS.categories.fileRepo.actionsSidebar,
                                action: 'Download File',
                                label: url,
                              });
                              a.download = url.split('/').slice(-1);
                              a.click();
                            })
                            .catch(err => {
                              trackUserInteraction({
                                category: TRACKING_EVENTS.categories.fileRepo.actionsSidebar,
                                action: 'Download File FAILED',
                                label:
                                  'Your account does not have the required permission to download this file.',
                              });
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
                                        <Trans>Failed!</Trans>
                                      </div>
                                      <Trans>Unable to download file</Trans>
                                      <div
                                        css={`
                                          color: 'red';
                                          margin-bottom: 20px;
                                          padding: 20px;
                                        `}
                                      >
                                        <span>
                                          <Trans i18nKey="fileRepoSidebar.missingDownloadPermissions">
                                            Your account does not have the required permission to
                                            download this file.
                                          </Trans>
                                        </span>
                                      </div>
                                    </div>
                                  </div>
                                ),
                              });
                            });
                        }}
                        render={({ onClick, loading, disabled }) => (
                          <DownloadButton
                            disabled={props.selectedTableRows.length !== 1 || loading}
                            onClick={onClick}
                            loading={loading}
                          />
                        )}
                      />
                    </Subsection>
                  );
                }}
              />
              <Subsection heading={<Trans>Reports</Trans>}>
                <ReportsDownloadInput
                  {...{
                    className: css`
                      flex: 1;
                    `,
                    api,
                    sqon,
                    index,
                    projectId,
                    theme,
                    effects,
                  }}
                />
              </Subsection>
            </div>
            <Divider />
            <Heading>
              <Trans>Data Analysis</Trans>
            </Heading>
            <CavaticaCopyButton {...props} />
          </div>
        </div>
      </SlidablePanel>
    );
  },
);

export default FileRepoSidebar;
