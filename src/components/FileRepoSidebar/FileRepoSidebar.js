import React from 'react';
import styled, { css } from 'react-emotion';
import { compose, withState } from 'recompose';
import { withTheme } from 'emotion-theming';
import { Trans } from 'react-i18next';
import { injectState } from 'freactal';
import { ColumnsState } from '@arranger/components/dist/DataTable';

import LeftChevron from 'icons/DoubleChevronLeftIcon';
import RightChevron from 'icons/DoubleChevronRightIcon';
import Heading from 'uikit/Heading';
import CavaticaCopyButton from 'components/cavatica/CavaticaCopyButton';
import FamilyManifestModal from '../FamilyManifestModal';
import Subsection from './Subsection';
import ReportsDownloadInput from './ReportsDownloadInput';
import { Slideable, Container, Titlebar, Content, Text, Section, DownloadButton } from './ui';
import { trackUserInteraction, TRACKING_EVENTS } from 'services/analyticsTracking';
import {
  downloadBiospecimen,
  clinicalDataParticipants,
  clinicalDataFamily,
} from 'services/downloadData';

const StyledReportsDownloadInput = styled(ReportsDownloadInput)`
  width: 100%;
`;

const FileManifestsDownloadInput = compose(injectState)(({ effects: { setModal }, ...props }) => (
  <DownloadButton
    onClick={() =>
      setModal({
        title: 'Download Manifest',
        component: <FamilyManifestModal {...props} />,
      })
    }
    content={() => <Trans>Manifest</Trans>}
    {...props}
  />
));

const BioSpecimentDownloadButton = ({ sqon, projectId, ...props }) => (
  <ColumnsState
    projectId={projectId}
    graphqlField="participant"
    render={({ state }) => (
      <DownloadButton
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
        content={() => <Trans>BioSpecimen</Trans>}
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
            <Trans>Actions</Trans>
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
            <Heading>
              <Trans>Data Analysis</Trans>
            </Heading>
            <CavaticaCopyButton {...props} />
          </Section>
          <Section>
            <Heading>
              <Trans>Download</Trans>
            </Heading>
            <Subsection>
              <FileManifestsDownloadInput {...props} />
              <BioSpecimentDownloadButton {...props} />
            </Subsection>
            <Subsection>
              <StyledReportsDownloadInput {...props} />
            </Subsection>
          </Section>
        </Content>
      </Container>
    </Slideable>
  ),
);

export default FileRepoSidebar;
