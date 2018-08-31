import React from 'react';
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
  }
  &:hover {
    background: ${({ theme }) => theme.greyScale10};
  }
`;

export default compose(withApi, injectState)(props => {
  const { api, sqon, projectId } = props;
  return (
    <ColumnsState
      projectId={projectId}
      graphqlField="participant"
      render={({ state: columnState }) => {
        const onParticipantDownloadSelect = async () => {
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
        const onParticipantAndFamilyDownloadSelect = async () => {
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
        const isFamilyDownloadAvailable = async () => {
          const { familyMembersWithoutParticipantIds } = await familyMemberAndParticipantIds({
            api,
            sqon,
          });
          return Boolean((familyMembersWithoutParticipantIds || []).length);
        };
        const FamilyDownloadAvailabilityProvider = ({ render }) => (
          <Component
            initialState={{ isLoading: true, available: false }}
            didMount={async ({ state, setState }) =>
              setState({ isLoading: false, available: await isFamilyDownloadAvailable() })
            }
          >
            {({ state }) => render(state)}
          </Component>
        );
        return (
          <Downshift>
            {({ isOpen, toggleMenu, openMenu, closeMenu, ...stuff }) => (
              <div>
                <DownloadButton
                  content={() => <Trans>Clinical</Trans>}
                  onClick={toggleMenu}
                  {...props}
                />
                {isOpen ? (
                  <div style={{ position: 'relative' }}>
                    <DropdownOptionsContainer hideTip align={'left'}>
                      <OptionRow onClick={() => onParticipantDownloadSelect().then(closeMenu)}>
                        Participant
                      </OptionRow>
                      <FamilyDownloadAvailabilityProvider
                        render={({ available, isLoading }) =>
                          available ? (
                            <OptionRow
                              onClick={() => onParticipantAndFamilyDownloadSelect().then(closeMenu)}
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
                    </DropdownOptionsContainer>
                  </div>
                ) : null}
              </div>
            )}
          </Downshift>
        );
      }}
    />
  );
});
