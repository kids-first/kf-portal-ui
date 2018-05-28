import React from 'react';
import styled, { css } from 'react-emotion';
import { compose, withState } from 'recompose';
import { withTheme } from 'emotion-theming';
import { Trans } from 'react-i18next';

import LeftChevron from 'icons/DoubleChevronLeftIcon';
import RightChevron from 'icons/DoubleChevronRightIcon';
import Heading from 'uikit/Heading';
import CavaticaCopyButton from 'components/cavatica/CavaticaCopyButton';

import FileManifestsDownloadInput from './FileManifestsDownloadInput';
import Subsection from './Subsection';
import ReportsDownloadInput from './ReportsDownloadInput';

const styles = ({ containerWidth, contentSidePadding, expanded, theme }) => ({
  container: css`
    overflow-y: auto;
    background-color: #f4f5f8;
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
        border-color: #c6c7cc;
        border-style: solid;
        border-width: 0 0 0 1px;
        box-sizing: border-box;
        box-shadow: 0 0 4.9px 0.2px #a0a0a3;
        overflow: hidden;
      `}
      {...rest}
    />
  );
};

const FileRepoSidebar = compose(withTheme, withState('expanded', 'setExpanded', true))(
  ({
    theme,
    expanded,
    setExpanded,
    style,
    containerWidth = 310,
    contentSidePadding = 15,
    panelStyle = styles({ containerWidth, contentSidePadding, theme, expanded }),
    ...props
  }) => (
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
              <FileManifestsDownloadInput {...props} />
            </Subsection>
            <Subsection heading={<Trans>Reports</Trans>}>
              <ReportsDownloadInput {...props} />
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
  ),
);

export default FileRepoSidebar;
