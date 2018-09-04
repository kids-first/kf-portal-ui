import React from 'react';
import { css } from 'react-emotion';
import { compose, withState } from 'recompose';
import { withTheme } from 'emotion-theming';
import { Trans } from 'react-i18next';
import { injectState } from 'freactal';
import { ColumnsState } from '@arranger/components/dist/DataTable';
import styled from 'react-emotion';

import LeftChevron from 'icons/DoubleChevronLeftIcon';
import RightChevron from 'icons/DoubleChevronRightIcon';
import Heading from 'uikit/Heading';
import Column from 'uikit/Column';
import CavaticaCopyButton from 'components/cavatica/CavaticaCopyButton';
import FamilyManifestModal from '../FamilyManifestModal';
import { trackUserInteraction, TRACKING_EVENTS } from 'services/analyticsTracking';
import { downloadBiospecimen } from 'services/downloadData';
import { Slideable, Container, Titlebar, Content, Text, Section, DownloadButton } from './ui';
import ClinicalDownloadButton from './ClinicalDownloadButton';
import FileManifestsDownloadInput from './FileManifestsDownloadInput';
import Subsection from './Subsection';
import ReportsDownloadInput from './ReportsDownloadInput';
import { FileRepoH2 as H2, FileRepoH3 as H3 } from '../../uikit/Headings';

const DownloadButtonsContainer = styled(Column)`
  justify-content: space-between;
  flex-wrap: wrap;
  width: 150px;
  & > * {
    width: 100%;
  }
`;

const Slideable = styled('div')`
  position: relative;
  transition: all 0.25s;
  width: ${({ expanded, containerWidth, contentSidePadding }) =>
    expanded ? `calc(${containerWidth} + ${contentSidePadding * 2}px)` : '40px'};
  max-width: 300px;
  overflow: hidden;
  box-shadow: 0 0 4.9px 0.2px ${({ theme }) => theme.shadow};
`;

const Container = styled('div')`
  overflow-y: auto;
  flex-grow: 0;
  flex-shrink: 1;
  width: 100%;
  min-width: 265px;
  height: 100%;
  background: ${({ theme }) => theme.backgroundGrey};
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
  height: 100%;
`;

const Text = styled('div')`
  font-size: 14px;
  line-height: 26px;
`;

const Section = styled('div')`
  padding-top: 20px;
  padding-bottom: 20px;
  &:not(:last-child) {
    border-bottom: solid 1px ${({ theme }) => theme.greyScale8};
  }
`;

const FileManifestsDownloadInput = compose(injectState)(({ effects: { setModal }, ...props }) => (
  <DownloadButton
    content={() => <Trans>Manifest</Trans>}
    onClick={() =>
      setModal({
        title: 'Download Manifest',
        component: <FamilyManifestModal {...props} />,
      })
    }
    {...props}
  />
));

const BioSpecimentDownloadButton = ({ sqon, projectId, ...props }) => (
  <ColumnsState
    projectId={projectId}
    graphqlField="participant"
    render={({ state }) => (
      <DownloadButton
        content={() => <Trans>BioSpecimen</Trans>}
        onClick={() => {
          let downloadConfig = { sqon, columns: state.columns };
          trackUserInteraction({
            category: TRACKING_EVENTS.categories.fileRepo.actionsSidebar,
            action: TRACKING_EVENTS.actions.download.report,
            label: 'Biospecimen',
          });
          const downloader = downloadBiospecimen(downloadConfig);
          return downloader();
        }}
        {...props}
      />
    )}
  />
);

const FileRepoSidebar = compose(withTheme, withState('expanded', 'setExpanded', true))(
  ({
    theme,
    expanded,
    setExpanded,
    style,
    containerWidth = '25%',
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
            <H2 display="inline-block">
              <Trans>Actions</Trans>
            </H2>
          </Heading>
        </Titlebar>
        <Content {...{ expanded, contentSidePadding, containerWidth }}>
          <Section>
            <Text>
              <Trans i18nKey="fileRepoSidebar.noneSelected">
                If you have not selected any files, all files in your query will be included in the
                actions.
              </Trans>
            </Text>
          </Section>
          <Section>
            <H3 mb="15px">
              <Trans>Data Analysis</Trans>
            </H3>
            <CavaticaCopyButton {...props} />
          </Section>
          <Section>
            <Heading>
              <Trans>Download</Trans>
            </Heading>
            <DownloadButtonsContainer>
              <FileManifestsDownloadInput {...props} />
              <BioSpecimentDownloadButton {...props} />
              <ClinicalDownloadButton {...props} />
            </DownloadButtonsContainer>
          </Section>
        </Content>
      </Container>
    </Slideable>
  ),
);

export default FileRepoSidebar;
