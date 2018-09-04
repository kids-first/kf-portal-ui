import React, { Fragment } from 'react';
import styled from 'react-emotion';
import { compose } from 'recompose';
import { Trans } from 'react-i18next';
import { injectState } from 'freactal';
import { ColumnsState } from '@arranger/components/dist/DataTable';
import Downshift from 'downshift';
import { uniq } from 'lodash';
import Component from 'react-component-component';

import { familyMemberAndParticipantIds } from '../FamilyManifestModal';
import Row from 'uikit/Row';
import { DropdownOptionsContainer } from 'uikit/Dropdown';
import { trackUserInteraction, TRACKING_EVENTS } from 'services/analyticsTracking';
import { clinicalDataParticipants, clinicalDataFamily } from 'services/downloadData';
import { DownloadButton } from './ui';
import { withApi } from 'services/api';
import { DropDownState } from 'components/Header/AppsMenu';

const StyledDropdownOptionsContainer = styled(DropdownOptionsContainer)`
  position: relative;
  width: 200px;
  border-radius: 7px;
`;

const Tooltip = styled('div')`
  position: absolute;
  top: 100%;
  background: white;
  padding: 5px;
  margin-top: -6px;
  border-radius: 7px;
  box-shadow: 1px 1px 7px ${theme => theme.greyScale0};
`;

const OptionRow = styled(Row)`
  padding: 10px;
  font-size: 12px;
  color: ${({ theme, disabled }) => (disabled ? theme.greyScale1 : 'auto')};
  background: ${({ theme, disabled }) => (disabled ? theme.greyScale10 : theme.white)};
  &:first-child {
    border-bottom: solid 1px ${({ theme }) => theme.borderGrey};
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

const participantDownloader = ({ api, sqon, columnState }) => async () => {
  const { participantIds } = await familyMemberAndParticipantIds({
    api,
    sqon,
  });
  let downloadConfig = {
    sqon: {
      op: 'in',
      content: {
        field: 'participants.kf_id',
        value: participantIds,
      },
    },
    columns: columnState.columns,
  };
  trackUserInteraction({
    category: TRACKING_EVENTS.categories.fileRepo.actionsSidebar,
    action: TRACKING_EVENTS.actions.download.report,
    label: 'Clinical (Participant)',
  });
  const downloader = clinicalDataParticipants(downloadConfig);
  return downloader();
};

const familyDownloader = ({ api, sqon, columnState }) => async () => {
  const { familyMemberIds, participantIds } = await familyMemberAndParticipantIds({
    api,
    sqon,
  });
  let downloadConfig = {
    sqon: {
      op: 'in',
      content: {
        field: 'participants.kf_id',
        value: uniq([...familyMemberIds, ...participantIds]),
      },
    },
    columns: columnState.columns,
  };
  trackUserInteraction({
    category: TRACKING_EVENTS.categories.fileRepo.actionsSidebar,
    action: TRACKING_EVENTS.actions.download.report,
    label: 'Clinical (Participant and family)',
  });
  const downloader = clinicalDataFamily(downloadConfig);
  return downloader();
};

export default compose(withApi, injectState)(props => {
  const { api, sqon, projectId } = props;
  const buttonRef = { current: null };
  return (
    <ColumnsState
      projectId={projectId}
      graphqlField="participant"
      render={({ state: columnState }) => {
        const participantDownload = participantDownloader({ api, sqon, columnState });
        const participantAndFamilyDownload = familyDownloader({ api, sqon, columnState });
        return (
          <Component initialState={{ isDownloading: false }}>
            {({ state: { isDownloading }, setState: setDownloadingState }) => (
              <DropDownState
                render={({ isDropdownVisible, setDropdownVisibility, toggleDropdown }) => (
                  <Fragment>
                    <DownloadButton
                      buttonRef={buttonRef}
                      content={() => <Trans>Clinical</Trans>}
                      onBlur={async e => {
                        if (!isDownloading) {
                          setDropdownVisibility(false);
                        }
                      }}
                      onClick={() => {
                        toggleDropdown();
                      }}
                      {...props}
                    />
                    {isDropdownVisible ? (
                      <StyledDropdownOptionsContainer hideTip align={'left'}>
                        <OptionRow
                          onMouseDown={() => {
                            setDownloadingState({ isDownloading: true });
                            participantDownload().then(() => {
                              setDropdownVisibility(false);
                              setDownloadingState({ isDownloading: false });
                            });
                          }}
                        >
                          Participant
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
                                Participant and family
                              </OptionRow>
                            ) : (
                              <OptionRow disabled>
                                Participant and family
                                {isLoading ? null : (
                                  <Tooltip>No file was found for family members</Tooltip>
                                )}
                              </OptionRow>
                            )
                          }
                        />
                      </StyledDropdownOptionsContainer>
                    ) : null}
                  </Fragment>
                )}
              />
            )}
          </Component>
        );
      }}
    />
  );
});
