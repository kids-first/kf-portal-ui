import React from 'react';
import styled, { css } from 'react-emotion';
import { compose, withState } from 'recompose';
import { withTheme } from 'emotion-theming';
import { Trans } from 'react-i18next';
import { injectState } from 'freactal';
import { ColumnsState } from '@arranger/components/dist/DataTable';
import Downshift from 'downshift';

import LeftChevron from 'icons/DoubleChevronLeftIcon';
import RightChevron from 'icons/DoubleChevronRightIcon';
import Heading from 'uikit/Heading';
import Row from 'uikit/Row';
import { DropdownContainer, DropdownOptionsContainer } from 'uikit/Dropdown';
import CavaticaCopyButton from 'components/cavatica/CavaticaCopyButton';
import FamilyManifestModal from '../FamilyManifestModal';
import { trackUserInteraction, TRACKING_EVENTS } from 'services/analyticsTracking';
import {
  downloadBiospecimen,
  clinicalDataParticipants,
  clinicalDataFamily,
} from 'services/downloadData';
import { Slideable, Container, Titlebar, Content, Text, Section, DownloadButton } from './ui';

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

const ClinicalDownloadButton = compose()(props => {
  return (
    <Downshift>
      {({ isOpen, toggleMenu, openMenu, closeMenu, ...stuff }) => (
        <div>
          <DownloadButton content={() => <Trans>Clinical</Trans>} onClick={toggleMenu} {...props} />
          {isOpen ? (
            <div style={{ position: 'relative' }}>
              <DropdownOptionsContainer hideTip align={'left'}>
                <Row>{'asdfsdfg'}</Row>
                <Row>{'asdfsdfg'}</Row>
              </DropdownOptionsContainer>
            </div>
          ) : null}
        </div>
      )}
    </Downshift>
  );
});

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
            <Row justifyContent={'space-between'} flexWrap={'wrap'}>
              <FileManifestsDownloadInput {...props} />
              <BioSpecimentDownloadButton {...props} />
              <ClinicalDownloadButton {...props} />
            </Row>
          </Section>
        </Content>
      </Container>
    </Slideable>
  ),
);

export default FileRepoSidebar;
