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

const Slideable = styled('div')`
  position: relative;
  transition: all 0.25s;
  width: ${({ expanded, containerWidth, contentSidePadding }) =>
    expanded ? `${containerWidth + contentSidePadding * 2}px` : '40px'};
`;

const Container = styled('div')`
  overflow-y: auto;
  box-shadow: 0 0 4.9px 0.2px ${({ theme }) => theme.shadow};
  flex-grow: 0;
  flex-shrink: 1;
  width: ${({ containerWidth, contentSidePadding }) => containerWidth + contentSidePadding * 2}px;
  min-width: 265px;
  height: 100%;
`;

const Titlebar = styled('div')`
  background-color: ${({ theme }) => theme.greyScale5};
  margin: 0px;
  display: flex;
  padding-top: 15px;
  padding-left: 15px;
  cursor: pointer;
`;

const Content = styled('div')`
  padding-left: ${({ expanded, contentSidePadding }) =>
    expanded ? contentSidePadding : contentSidePadding * 10}px;
  overflow: hidden;
  padding-right: ${({ contentSidePadding }) => contentSidePadding}px;
  transition: all 0.25s;
  padding-top: 10px;
`;

const Text = styled('div')`
  font-size: 14px;
  line-height: 26px;
`;

const Divider = styled('div')`
  height: 1px;
  background-color: ${({ theme }) => theme.greyScale8};
  margin: 20px 0px;
`;

const FileRepoSidebar = compose(withTheme, withState('expanded', 'setExpanded', true))(
  ({
    theme,
    expanded,
    setExpanded,
    style,
    containerWidth = 310,
    contentSidePadding = 15,
    ...props
  }) => (
    <Slideable {...{ contentSidePadding, containerWidth, expanded }}>
      <Container {...{ contentSidePadding, containerWidth }}>
        <Titlebar onClick={() => setExpanded(!expanded)}>
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
        </Titlebar>
        <Content {...{ expanded, contentSidePadding, containerWidth }}>
          <Text>
            <Trans i18nKey="fileRepoSidebar.noneSelected">
              If you have not selected any files, all files in your query will be included in the
              actions.
            </Trans>
          </Text>
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
        </Content>
      </Container>
    </Slideable>
  ),
);

export default FileRepoSidebar;
