import React, { Fragment } from 'react';
import styled from 'react-emotion';
import { compose } from 'recompose';
import { Trans } from 'react-i18next';
import { injectState } from 'freactal';
import { ColumnsState } from '@kfarranger/components/dist/DataTable';
import { uniq } from 'lodash';
import Component from 'react-component-component';

import { familyMemberAndParticipantIds } from '../FamilyManifestModal';
import Row from 'uikit/Row';
import { DropdownOptionsContainer } from 'uikit/Dropdown';
import { trackUserInteraction, TRACKING_EVENTS } from 'services/analyticsTracking';
import {
  clinicalDataParticipants,
  clinicalDataFamily,
  downloadBiospecimen,
} from 'services/downloadData';
import { DownloadButton } from './ui';
import { withApi } from 'services/api';
import { DropDownState } from 'components/Header/AppsMenu';
import FamilyManifestModal from '../FamilyManifestModal/FamilyManifestModal';
import Tooltip from 'uikit/Tooltip';

const StyledDropdownOptionsContainer = styled(DropdownOptionsContainer)`
  position: absolute;
  width: 300px;
  top: 32px;
  left: 4px;
`;

const OptionRow = styled(Row)`
  padding: 5px;
  font-size: 10px;
  color: ${({ theme, disabled }) => (disabled ? theme.greyScale1 : 'auto')};
  background: ${({ theme, disabled }) => (disabled ? theme.greyScale10 : theme.white)};
  border-top: solid 1px ${({ theme }) => theme.borderGrey};
  &:first-child {
    border-top: none;
    border-top-left-radius: 7px;
    border-top-right-radius: 7px;
  }
  &:last-child {
    border-bottom-left-radius: 7px;
    border-bottom-right-radius: 7px;
  }
  &:hover {
    background: ${({ theme }) => theme.greyScale10};
  }
`;

const FamilyDownloadAvailabilityProvider = compose(withApi)(({ render, api, sqon }) => {
  const isFamilyDownloadAvailable = async () => {
    const { familyMembersWithoutParticipantIds } = await familyMemberAndParticipantIds({
      api,
      sqon,
    });
    return Boolean((familyMembersWithoutParticipantIds || []).length);
  };
  return (
    <Component
      initialState={{ isLoading: true, available: false }}
      didMount={async ({ state, setState }) =>
        setState({ isLoading: false, available: await isFamilyDownloadAvailable() })
      }
    >
      {({ state }) => render(state)}
    </Component>
  );
});

const participantDownloader = ({ api, sqon, columnState, isFileRepo }) => async () => {
  const { participantIds } = await familyMemberAndParticipantIds({
    api,
    sqon,
    isFileRepo,
  });
  let downloadConfig = {
    sqon: {
      op: 'in',
      content: {
        field: isFileRepo ? 'participants.kf_id' : 'kf_id',
        value: participantIds,
      },
    },
    columns: columnState.columns,
    isFileRepo: isFileRepo,
  };
  trackUserInteraction({
    category: TRACKING_EVENTS.categories.fileRepo.actionsSidebar,
    action: TRACKING_EVENTS.actions.download.report,
    label: 'Clinical (Participant)',
  });
  const downloader = clinicalDataParticipants(downloadConfig);
  return downloader();
};

const familyDownloader = ({ api, sqon, columnState, isFileRepo }) => async () => {
  const { familyMemberIds, participantIds } = await familyMemberAndParticipantIds({
    api,
    sqon,
    isFileRepo,
  });
  let downloadConfig = {
    sqon: {
      op: 'in',
      content: {
        field: isFileRepo ? 'participants.kf_id' : 'kf_id',
        value: uniq([...familyMemberIds, ...participantIds]),
      },
    },
    columns: columnState.columns,
    isFileRepo: isFileRepo,
  };

  trackUserInteraction({
    category: TRACKING_EVENTS.categories.fileRepo.actionsSidebar,
    action: TRACKING_EVENTS.actions.download.report,
    label: 'Clinical (Participant and family)',
  });
  const downloader = clinicalDataFamily(downloadConfig);
  return downloader();
};

const biospecimenDownloader = ({ api, sqon, columnState, isFileRepo }) => async () => {
  let downloadConfig = { sqon, columns: columnState.columns, isFileRepo };
  trackUserInteraction({
    category: TRACKING_EVENTS.categories.fileRepo.actionsSidebar,
    action: TRACKING_EVENTS.actions.download.report,
    label: 'Biospecimen',
  });
  const downloader = downloadBiospecimen(downloadConfig);
  return downloader();
};

export default compose(
  withApi,
  injectState,
)(({ effects: { setModal }, ...props }) => {
  const { api, sqon, projectId, isFileRepo, disabled = false } = props;
  return (
    <ColumnsState
      projectId={projectId}
      graphqlField="participant"
      render={({ state: columnState }) => {
        const participantDownload = participantDownloader({ api, sqon, columnState, isFileRepo });
        const participantAndFamilyDownload = familyDownloader({
          api,
          sqon,
          columnState,
          isFileRepo,
        });
        const biospecimenDownload = biospecimenDownloader({ api, sqon, columnState, isFileRepo });
        return (
          <div style={{ position: 'relative', marginLeft: '15px' }}>
            <Component initialState={{ isDownloading: false }}>
              {({ state: { isDownloading }, setState: setDownloadingState }) => (
                <DropDownState
                  render={({ isDropdownVisible, setDropdownVisibility, toggleDropdown }) => (
                    <Fragment>
                      <DownloadButton
                        content={() => <Trans>Download</Trans>}
                        onBlur={async e => {
                          if (!isDownloading) {
                            setDropdownVisibility(false);
                          }
                        }}
                        onClick={() => {
                          toggleDropdown();
                        }}
                        disabled={disabled}
                      />
                      {isDropdownVisible ? (
                        <StyledDropdownOptionsContainer hideTip>
                          <OptionRow
                            onMouseDown={() => {
                              setDownloadingState({ isDownloading: true });
                              participantDownload().then(() => {
                                setDropdownVisibility(false);
                                setDownloadingState({ isDownloading: false });
                              });
                            }}
                          >
                            Clinical Data: Participants only
                          </OptionRow>
                          <FamilyDownloadAvailabilityProvider
                            sqon={sqon}
                            render={({ available, isLoading }) =>
                              available ? (
                                <OptionRow
                                  onMouseDown={() => {
                                    setDownloadingState({ isDownloading: true });
                                    participantAndFamilyDownload().then(() => {
                                      setDropdownVisibility(false);
                                      setDownloadingState({ isDownloading: false });
                                    });
                                  }}
                                >
                                  Clinical Data: Participant & Family Members
                                </OptionRow>
                              ) : (
                                <OptionRow disabled>
                                  <Tooltip
                                    html={
                                      isLoading
                                        ? 'Calculating...'
                                        : 'No report available for additional family members.'
                                    }
                                  >
                                    Clinical Data: Participant & Family Members
                                  </Tooltip>
                                </OptionRow>
                              )
                            }
                          />
                          <OptionRow
                            onMouseDown={() => {
                              setDownloadingState({ isDownloading: true });
                              biospecimenDownload().then(() => {
                                setDropdownVisibility(false);
                                setDownloadingState({ isDownloading: false });
                              });
                            }}
                          >
                            Biospecimen Data
                          </OptionRow>
                          {isFileRepo && (
                            <OptionRow
                              onMouseDown={() => {
                                setModal({
                                  title: 'Download Manifest',
                                  component: <FamilyManifestModal {...props} />,
                                });
                              }}
                            >
                              File Manifest
                            </OptionRow>
                          )}
                        </StyledDropdownOptionsContainer>
                      ) : null}
                    </Fragment>
                  )}
                />
              )}
            </Component>
          </div>
        );
      }}
    />
  );
});
