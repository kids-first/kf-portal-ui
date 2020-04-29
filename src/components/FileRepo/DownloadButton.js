import React, { Fragment } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { compose } from 'recompose';
import { injectState } from 'freactal';
import uniq from 'lodash/uniq';
import noop from 'lodash/noop';
import uniqueId from 'lodash/uniqueId';
import Component from 'react-component-component';
import autobind from 'auto-bind-es5';
import { ColumnsState } from '@kfarranger/components/dist/DataTable';
import { familyMemberAndParticipantIds } from '../FamilyManifestModal';
import Row from 'uikit/Row';
import { DropdownOptionsContainer } from 'uikit/Dropdown';
import Tooltip from 'uikit/Tooltip';
import { trackUserInteraction, TRACKING_EVENTS } from 'services/analyticsTracking';
import {
  clinicalDataParticipants,
  clinicalDataFamily,
  downloadBiospecimen,
} from 'services/downloadData';
import { withApi } from 'services/api';
import FamilyManifestModal from '../FamilyManifestModal/FamilyManifestModal';
import {
  clinicalDataReport,
  familyClinicalDataReport,
  biospecimenDataReport,
} from 'services/reports';
import { displayError } from 'store/actionCreators/errors';
import { styleComponent } from 'components/Utils';

import './DownloadButton.css';

import { DownloadOutlined } from '@ant-design/icons';
import { Button } from 'antd';

const StyledDropdownOptionsContainer = styleComponent(
  DropdownOptionsContainer,
  'downloadButtonDropdownOptionsContainer',
);

const OptionRow = styleComponent(Row, 'downloadButtonOptionRow');

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
  if (isFileRepo) {
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
  if (isFileRepo) {
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
  if (isFileRepo) {
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

const downloadReport = async (reportName, sqon) => {
  const reportMap = {
    clinicalData: clinicalDataReport,
    familyClinicalData: familyClinicalDataReport,
    biospecimenData: biospecimenDataReport,
  };
  const reportFn = reportMap[reportName] || Promise.resolve();

  return await reportFn(sqon);
};

class DownloadButton extends React.Component {
  constructor(props) {
    super(props);
    autobind(this);

    this.state = {
      isDownloadingReport: false,
      isFamilyReportAvailable: false,
      isLoadingFamilyInfo: true,
      isDropdownVisible: false,
    };

    if (this.props.isFileRepo) {
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
    // from redux
    displayError: PropTypes.func.isRequired,
    // from composition
    api: PropTypes.func.isRequired,
    effects: PropTypes.shape({
      setModal: PropTypes.func.isRequired,
    }).isRequired,
    // passed down as props
    sqon: PropTypes.object,
    projectId: PropTypes.string.isRequired, // required only if isFileRepo is true
    disabled: PropTypes.bool,
    isFileRepo: PropTypes.bool,
    onDownloadStarts: PropTypes.func,
    onDownloadEnds: PropTypes.func,
    className: PropTypes.string,
  };

  static defaultProps = {
    disabled: false,
    isFileRepo: false,
    onDownloadStarts: noop,
    onDownloadEnds: noop,
    className: '',
  };

  renderReportDropdownItem(report) {
    const { name, label, unavailableLabel = label, isAvailable = true, isLoading = false } = report;
    const { sqon, onDownloadEnds, onDownloadStarts } = this.props;
    return isAvailable ? (
      <OptionRow
        key={name}
        onMouseDown={async () => {
          const downloadId = uniqueId('report-download-');
          onDownloadStarts(downloadId);
          this.setState({ isDownloadingReport: true });
          let error = null;
          try {
            await downloadReport(name, sqon);
          } catch (err) {
            error = err;
            this.props.displayError(`Error downloading the report`);
            console.error(`Error downloading the report`, err);
          } finally {
            this.setState({
              isDownloadingReport: false,
              isDropdownVisible: false,
            });
            onDownloadEnds(error, downloadId);
          }
        }}
      >
        {label}
      </OptionRow>
    ) : (
      <OptionRow key={name} disabled>
        <Tooltip html={isLoading ? 'Calculating...' : unavailableLabel}>{label}</Tooltip>
      </OptionRow>
    );
  }

  cohortBuilderRender() {
    const { disabled } = this.props;
    const {
      isDownloadingReport,
      isDropdownVisible,
      isFamilyReportAvailable,
      isLoadingFamilyInfo,
    } = this.state;

    const reportsOptions = [
      {
        name: 'clinicalData',
        label: 'Clinical Data: Participants only',
      },
      {
        name: 'familyClinicalData',
        label: 'Clinical Data: Participant & Family Members',
        unavailableLabel: 'No report available for additional family members.',
        isAvailable: isFamilyReportAvailable,
        isLoading: isLoadingFamilyInfo,
      },
      {
        name: 'biospecimenData',
        label: 'Biospecimen Data',
      },
    ];

    return (
      <Fragment>
        <DownloadButtonUI
          content={() => 'Download'}
          onBlur={() => {
            if (!isDownloadingReport) {
              this.setState({ isDropdownVisible: false });
            }
          }}
          onClick={() => this.setState({ isDropdownVisible: !this.state.isDropdownVisible })}
          disabled={disabled}
          className={this.props.className}
        />
        {isDropdownVisible ? (
          <StyledDropdownOptionsContainer hideTip>
            {reportsOptions.map(report => this.renderReportDropdownItem(report))}
          </StyledDropdownOptionsContainer>
        ) : null}
      </Fragment>
    );
  }

  fileRepoRender() {
    const {
      displayError,
      api,
      sqon,
      projectId,
      isFileRepo,
      disabled,
      effects: { setModal },
    } = this.props;
    const { isDownloadingReport, isDropdownVisible } = this.state;

    const handleDownloadReport = async reportFn => {
      this.setState({ isDownloadingReport: true });
      try {
        await reportFn();
      } catch (err) {
        displayError(`Error downloading the report`);
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
            <Fragment>
              <DownloadButtonUI
                content={() => 'Download'}
                onBlur={e => {
                  if (!isDownloadingReport) {
                    this.setState({ isDropdownVisible: false });
                  }
                }}
                onClick={() => this.setState({ isDropdownVisible: !this.state.isDropdownVisible })}
                disabled={disabled}
                className={this.props.className}
              />
              {isDropdownVisible ? (
                <StyledDropdownOptionsContainer hideTip>
                  <OptionRow
                    onMouseDown={async () => {
                      await handleDownloadReport(participantDownload);
                      this.setState({ isDropdownVisible: false });
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
                              this.setState({
                                isDropdownVisible: false,
                                isDownloadingReport: false,
                              });
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
                        this.setState({
                          isDropdownVisible: false,
                          isDownloadingReport: false,
                        });
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
          );
        }}
      />
    );
  }

  render() {
    const { isFileRepo = false } = this.props;

    return (
      <div style={{ position: 'relative', marginLeft: '15px' }}>
        {isFileRepo ? this.fileRepoRender() : this.cohortBuilderRender()}
      </div>
    );
  }
}

const mapDispatchToProps = {
  displayError,
};

export default compose(withApi, injectState, connect(null, mapDispatchToProps))(DownloadButton);

const DownloadButtonUI = ({ onClick, content, disabled, onBlur, className }) => {
  return (
    <Button
      className={className}
      type={'primary'}
      onClick={onClick}
      disabled={disabled}
      onBlur={onBlur}
      icon={<DownloadOutlined />}
    >
      {content()}
    </Button>
  );
};

DownloadButtonUI.defaultProps = {
  content: () => 'Download',
  onBlur: () => {},
  className: '',
  disabled: false,
};

DownloadButtonUI.propTypes = {
  onClick: PropTypes.func.isRequired,
  content: PropTypes.func,
  onBlur: PropTypes.func,
  className: PropTypes.string,
  disabled: PropTypes.bool,
};
