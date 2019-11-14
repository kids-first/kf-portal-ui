import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import styled from 'react-emotion';
import { compose } from 'recompose';
import { injectState } from 'freactal';
import uniq from 'lodash/uniq';
import Component from 'react-component-component';
import autobind from 'auto-bind-es5';
import { ColumnsState } from '@kfarranger/components/dist/DataTable';

import { familyMemberAndParticipantIds } from '../FamilyManifestModal';
import Row from 'uikit/Row';
import { DropdownOptionsContainer } from 'uikit/Dropdown';
import { trackUserInteraction, TRACKING_EVENTS } from 'services/analyticsTracking';
import {
  clinicalDataParticipants,
  clinicalDataFamily,
  downloadBiospecimen,
} from 'services/downloadData';
import { DownloadButton as DownloadButtonUI } from './ui';
import { withApi } from 'services/api';
import { DropDownState } from 'components/Header/AppsMenu';
import FamilyManifestModal from '../FamilyManifestModal/FamilyManifestModal';
import Tooltip from 'uikit/Tooltip';
import {
  clinicalDataReport,
  familyClinicalDataReport,
  biospecimenDataReport,
} from 'services/reports';
import { isFeatureEnabled } from 'common/featuresToggles';

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

const isFamilyDownloadAvailable = async ({ api, sqon }) => {
  const { familyMembersWithoutParticipantIds } = await familyMemberAndParticipantIds({
    api,
    sqon,
  });
  return Boolean((familyMembersWithoutParticipantIds || []).length);
};

const FamilyDownloadAvailabilityProvider = compose(withApi)(({ render, api, sqon }) => {
  return (
    <Component
      initialState={{ isLoading: true, available: false }}
      didMount={async ({ state, setState }) =>
        setState({ isLoading: false, available: await isFamilyDownloadAvailable({ api, sqon }) })
      }
    >
      {({ state }) => render(state)}
    </Component>
  );
});

const trackDownload = label => {
  trackUserInteraction({
    category: TRACKING_EVENTS.categories.fileRepo.actionsSidebar,
    action: TRACKING_EVENTS.actions.download.report,
    label: label,
  });
};

const participantDownloader = ({ api, sqon, columnState, isFileRepo }) => async () => {
  trackDownload('Clinical (Participant)');

  // Keep legacy code for File Repository Download button until the endpoint supports it
  if (isFileRepo || !isFeatureEnabled('clinicalDataReport')) {
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
    const downloader = clinicalDataParticipants(downloadConfig);
    return downloader();
  }

  // The new report
  return clinicalDataReport(sqon);
};

const familyDownloader = ({ api, sqon, columnState, isFileRepo }) => async () => {
  trackDownload('Clinical (Participant and family)');

  // Keep legacy code for File Repository Download button until the endpoint supports it
  if (isFileRepo || !isFeatureEnabled('clinicalDataReport')) {
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

    const downloader = clinicalDataFamily(downloadConfig);
    return downloader();
  }

  // The new report
  return familyClinicalDataReport(sqon);
};

const biospecimenDownloader = ({ api, sqon, columnState, isFileRepo }) => async () => {
  trackDownload('Biospecimen');

  // Keep legacy code for File Repository Download button until the endpoint supports it
  if (isFileRepo || !isFeatureEnabled('clinicalDataReport')) {
    let downloadConfig = { sqon, columns: columnState.columns, isFileRepo };
    const downloader = downloadBiospecimen(downloadConfig);
    return downloader();
  }

  // The new report
  return biospecimenDataReport(sqon);
};

const queryHasFamilyMembers = async (api, sqon, isFileRepo) => {
  // TODO : check if the family report is available
  // the condition makes no sense, so just remove the condition atm.
  return Promise.resolve(true);

  // let response;
  // try {
  //   response = familyMemberAndParticipantIds({ api, sqon, isFileRepo });
  // } catch (err) {
  //   return false;
  // }
  // const extractResults = path => {
  //   get(response, 'data.participant.aggregations.kf_id.buckets', []).map(b => b.key);
  // };

  // return true;
};

class DownloadButton extends React.Component {
  constructor(props) {
    super(props);
    autobind(this);

    this.state = {
      isDownloadingReport: false,
      isFamilyReportAvailable: false,
      isLoadingFamilyInfo: true,
    };

    if (this.props.isFileRepo || !isFeatureEnabled('clinicalDataReport')) {
      // nothing for now
    } else {
      // check if the family report is available
      queryHasFamilyMembers(props.api, props.sqon, props.isFileRepo).then(active => {
        this.setState({
          isFamilyReportAvailable: active,
          isLoadingFamilyInfo: false,
        });
      });
    }
  }

  static propTypes = {
    api: PropTypes.func.isRequired,
    sqon: PropTypes.object.isRequired,
  };

  async downloadReport(reportName, sqon) {
    const reportMap = {
      clinicalData: clinicalDataReport,
      familyClinicalData: familyClinicalDataReport,
      biospecimenData: biospecimenDataReport,
    };
    const reportFn = reportMap[reportName] || Promise.resolve();

    this.setState({ isDownloadingReport: true });
    try {
      await reportFn(sqon);
    } catch (err) {
      console.error(`Error downloading the report`, err);
    } finally {
      this.setState({ isDownloadingReport: false });
    }
  }

  renderReportDropdownItem(reportName, label, sqon, setDropdownVisibility) {
    return (
      <OptionRow
        onMouseDown={async () => {
          await this.downloadReport(reportName, sqon);
          setDropdownVisibility(false);
        }}
      >
        {label}
      </OptionRow>
    );
  }

  cohortBuilderRender() {
    const { sqon, disabled = false } = this.props;
    const { isDownloadingReport, isFamilyReportAvailable, isLoadingFamilyInfo } = this.state;

    return (
      <DropDownState
        render={({ isDropdownVisible, setDropdownVisibility, toggleDropdown }) => (
          <Fragment>
            <DownloadButtonUI
              content={() => 'Download'}
              onBlur={() => {
                if (!isDownloadingReport) {
                  setDropdownVisibility(false);
                }
              }}
              onClick={() => toggleDropdown()}
              disabled={disabled}
            />
            {isDropdownVisible ? (
              <StyledDropdownOptionsContainer hideTip>
                {this.renderReportDropdownItem(
                  'clinicalData',
                  'Clinical Data: Participants only',
                  sqon,
                  setDropdownVisibility,
                )}
                {isFamilyReportAvailable ? (
                  this.renderReportDropdownItem(
                    'familyClinicalData',
                    'Clinical Data: Participant & Family Members',
                    sqon,
                    setDropdownVisibility,
                  )
                ) : (
                  <OptionRow disabled>
                    <Tooltip
                      html={
                        isLoadingFamilyInfo
                          ? 'Calculating...'
                          : 'No report available for additional family members.'
                      }
                    >
                      Clinical Data: Participant & Family Members
                    </Tooltip>
                  </OptionRow>
                )}
                {this.renderReportDropdownItem(
                  'biospecimenData',
                  'Biospecimen Data',
                  sqon,
                  setDropdownVisibility,
                )}
              </StyledDropdownOptionsContainer>
            ) : null}
          </Fragment>
        )}
      />
    );
  }

  fileRepoRender() {
    const {
      api,
      sqon,
      projectId,
      isFileRepo,
      disabled = false,
      effects: { setModal },
    } = this.props;
    const { isDownloadingReport } = this.state;

    const handleDownloadReport = async reportFn => {
      this.setState({ isDownloadingReport: true });
      try {
        await reportFn();
      } catch (err) {
        console.error(`Error downloading the report`, err);
      } finally {
        this.setState({ isDownloadingReport: false });
      }
    };

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
            <DropDownState
              render={({ isDropdownVisible, setDropdownVisibility, toggleDropdown }) => (
                <Fragment>
                  <DownloadButtonUI
                    content={() => 'Download'}
                    onBlur={e => {
                      if (!isDownloadingReport) {
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
                        onMouseDown={async () => {
                          await handleDownloadReport(participantDownload);
                          setDropdownVisibility(false);
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
                                this.setState({ isDownloadingReport: true });
                                participantAndFamilyDownload().then(() => {
                                  setDropdownVisibility(false);
                                  this.setState({ isDownloadingReport: false });
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
                          this.setState({ isDownloadingReport: true });
                          biospecimenDownload().then(() => {
                            setDropdownVisibility(false);
                            this.setState({ isDownloadingReport: false });
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
                              component: <FamilyManifestModal {...this.props} />,
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
          );
        }}
      />
    );
  }

  render() {
    const { isFileRepo } = this.props;

    return (
      <div style={{ position: 'relative', marginLeft: '15px' }}>
        {isFileRepo || !isFeatureEnabled('clinicalDataReport')
          ? this.fileRepoRender()
          : this.cohortBuilderRender()}
      </div>
    );
  }
}

export default compose(
  withApi,
  injectState,
)(DownloadButton);
