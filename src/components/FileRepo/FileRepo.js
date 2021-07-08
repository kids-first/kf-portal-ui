import React from 'react';
import FilterIcon from 'react-icons/lib/fa/filter';
import { connect } from 'react-redux';
import { BarChartOutlined } from '@ant-design/icons';
import { Arranger, CurrentSQON, Table } from '@kfarranger/components/dist/Arranger';
import { replaceSQON } from '@kfarranger/components/dist/SQONView/utils';
import { Button, Layout, Spin } from 'antd';
import { injectState } from 'freactal';
import isObject from 'lodash/isObject';
import PropTypes from 'prop-types';
import { compose } from 'recompose';

import { FENCES } from 'common/constants';
import { arrangerProjectId } from 'common/injectGlobals';
import translateSQON from 'common/translateSQONValue';
import ArrangerConnectionGuard from 'components/ArrangerConnectionGuard';
import AggregationSidebar from 'components/FileRepo/AggregationSidebar';
import SaveQuery from 'components/LoadShareSaveDeleteQuery/SaveQuery';
import ShareQuery from 'components/LoadShareSaveDeleteQuery/ShareQuery';
import SQONURL from 'components/SQONURL';
import { FileRepoStatsQuery } from 'components/Stats';
import useFenceConnections from 'hooks/useFenceConnections';
import DownloadIcon from 'icons/DownloadIcon';
import { TRACKING_EVENTS, trackUserInteraction } from 'services/analyticsTracking';
import { withApi } from 'services/api';
import { closeModal, openModal } from 'store/actions/modal';
import { selectModalId } from 'store/selectors/modal';
import theme from 'theme/defaultTheme';
import { fillCenter } from 'theme/tempTheme.module.css';
import Column from 'uikit/Column';
import { FilterInput } from 'uikit/Input';
import Row from 'uikit/Row';
import { Spinner } from 'uikit/Spinner';
import Tooltip from 'uikit/Tooltip';

import CavaticaConnectModal from '../cavatica/CavaticaConnectModal';
import CavaticaCopyMultipleFilesModal from '../cavatica/CavaticaCopyMultipleFilesModal';

import customTableColumns from './customTableColumns';
import DownloadButton from './DownloadButton';
import FileManifestButton from './FileManifestButton';
import StatsBar from './StatsBar';
import { ControlledIcon, OpenIcon, SaveShareButtonContainer } from './ui';

import './FileRepo.scss';

const trackFileRepoInteraction = ({ label, ...eventData }) =>
  trackUserInteraction({
    category: 'File Repo',
    action: 'default file repo action',
    ...eventData,
    ...(label && { label: isObject(label) ? JSON.stringify(label) : label }),
  });

const CAVATICA_CONNECT_FILE_REPO_MODAL_ID = 'CAVATICA_CONNECT_FILE_REPO_MODAL_ID';
const CAVATICA_COPY_FILE_REPO_MODAL_ID = 'CAVATICA_COPY_FILE_REPO_MODAL_ID';

const mapStateToProps = (state) => ({
  openModalId: selectModalId(state),
});

const mapDispatchToProps = (dispatch) => ({
  openModal: (id) => dispatch(openModal(id)),
  closeModal: (id) => dispatch(closeModal(id)),
});

const connector = connect(mapStateToProps, mapDispatchToProps);

const enhance = compose(connector, injectState, withApi);

const FileRepo = ({
  state,
  effects,
  gen3User,
  translateSQONValue = translateSQON({
    sets: (state.loggedInUser || {}).sets || [],
  }),
  userProjectIds = gen3User ? Object.keys(gen3User.projects) : [],
  isConnectedToCavatica,
  openModalId,
  closeModal,
  openModal,
  ...props
}) => {
  const {
    //needed in order to avoid rendering the main component on mount before fetching fences.
    isCheckingIfFenceConnectionsFetchIsNeeded,
    isFetchingAllFenceConnections,
    fenceConnections,
    fencesAllAcls,
  } = useFenceConnections(props.api, FENCES);

  if (isCheckingIfFenceConnectionsFetchIsNeeded || isFetchingAllFenceConnections) {
    return <Spinner size={'large'} />;
  }
  return (
    <SQONURL
      render={(url) => (
        <ArrangerConnectionGuard
          graphqlField={props.graphqlField}
          render={({ connecting, connectionError }) =>
            connecting || connectionError ? (
              <div className={fillCenter}>
                {connectionError ? (
                  `Unable to connect to the file repo, please try again later`
                ) : (
                  <Spin size={'large'} />
                )}
              </div>
            ) : (
              <Arranger
                {...props}
                projectId={arrangerProjectId}
                render={(props) => {
                  const selectionSQON = props.selectedTableRows.length
                    ? replaceSQON({
                        op: 'and',
                        content: [
                          {
                            op: 'in',
                            content: { field: 'kf_id', value: props.selectedTableRows },
                          },
                        ],
                      })
                    : url.sqon;

                  const showConnectModal = openModalId === CAVATICA_CONNECT_FILE_REPO_MODAL_ID;
                  const showCavaticaCopyModal = openModalId === CAVATICA_COPY_FILE_REPO_MODAL_ID;

                  const closeCopyCavaticaModal = () => closeModal(CAVATICA_COPY_FILE_REPO_MODAL_ID);

                  return (
                    <>
                      {showConnectModal && (
                        <CavaticaConnectModal
                          isVisible={showConnectModal}
                          onComplete={() => {
                            closeModal(CAVATICA_CONNECT_FILE_REPO_MODAL_ID);
                            openModal(CAVATICA_COPY_FILE_REPO_MODAL_ID);
                          }}
                          onCancelCB={() => closeModal(CAVATICA_CONNECT_FILE_REPO_MODAL_ID)}
                        />
                      )}
                      {showCavaticaCopyModal && (
                        <CavaticaCopyMultipleFilesModal
                          fileIds={props.selectedTableRows}
                          onComplete={closeCopyCavaticaModal}
                          onCancel={closeCopyCavaticaModal}
                          sqon={selectionSQON}
                          loggedInUser={state.loggedInUser}
                          fenceConnections={fenceConnections}
                          api={props.api}
                        />
                      )}
                      <Layout className="arranger-container">
                        <AggregationSidebar
                          {...{ ...props, ...url, translateSQONValue, effects }}
                          trackFileRepoInteraction={trackFileRepoInteraction}
                        />
                        <Column className="arranger-table-container">
                          <Row mb={url.sqon ? 3 : 0}>
                            <CurrentSQON
                              {...props}
                              {...url}
                              {...{ translateSQONValue }}
                              onClear={() => {
                                trackFileRepoInteraction({
                                  category: TRACKING_EVENTS.categories.fileRepo.dataTable,
                                  action: TRACKING_EVENTS.actions.query.clear,
                                });
                                trackFileRepoInteraction({
                                  category: 'File Repo',
                                  action: TRACKING_EVENTS.actions.query.abandoned,
                                  label: 'cleared SQON',
                                  value: 1,
                                });
                              }}
                            />
                            {url.sqon && Object.keys(url.sqon).length > 0 && (
                              <FileRepoStatsQuery
                                {...props}
                                {...url}
                                render={({ data: stats, loading: disabled }) => (
                                  <Row className="querySharing-container">
                                    <SaveShareButtonContainer>
                                      <ShareQuery
                                        api={props.api}
                                        url={url}
                                        stats={stats}
                                        disabled={!!disabled}
                                        loggedInUser={state.loggedInUser}
                                        sqon={url.sqon}
                                      />
                                    </SaveShareButtonContainer>
                                    <SaveShareButtonContainer>
                                      <SaveQuery
                                        api={props.api}
                                        url={url}
                                        stats={stats}
                                        disabled={!!disabled}
                                        loggedInUser={state.loggedInUser}
                                        sqon={url.sqon}
                                      />
                                    </SaveShareButtonContainer>
                                  </Row>
                                )}
                              />
                            )}
                          </Row>
                          <StatsBar api={props.api} sqon={selectionSQON} />
                          <Column className="arranger-table-wrapper">
                            <Table
                              {...props}
                              {...url}
                              keepSelectedOnPageChange
                              customHeaderContent={
                                <Row className={'relative'} right>
                                  <Tooltip
                                    position="top"
                                    hideTitle
                                    html={
                                      <Row className={'relative'} p={'10px'}>
                                        {'Cavatica is a cloud processing platform where files can be ' +
                                          'linked (not duplicated) and used immediately.'}
                                      </Row>
                                    }
                                  >
                                    <Button
                                      type={'primary'}
                                      icon={<BarChartOutlined />}
                                      onClick={() => {
                                        openModal(
                                          isConnectedToCavatica
                                            ? CAVATICA_COPY_FILE_REPO_MODAL_ID
                                            : CAVATICA_CONNECT_FILE_REPO_MODAL_ID,
                                        );
                                      }}
                                    >
                                      {'Analyze in Cavatica'}
                                    </Button>
                                  </Tooltip>
                                  <>
                                    <DownloadButton sqon={selectionSQON} />
                                    <FileManifestButton
                                      sqon={selectionSQON}
                                      projectId={arrangerProjectId}
                                    />
                                  </>
                                </Row>
                              }
                              customTypes={{
                                // eslint-disable-next-line react/display-name,react/prop-types
                                access: ({ value }) => (
                                  <Row className="controlledAccess" center>
                                    {typeof value !== 'boolean' ? (
                                      ``
                                    ) : value ? (
                                      <ControlledIcon width={12} height={12} />
                                    ) : (
                                      <OpenIcon />
                                    )}
                                  </Row>
                                ),
                              }}
                              showFilterInput={false}
                              InputComponent={(props) => (
                                <FilterInput {...props} LeftIcon={FilterIcon} />
                              )}
                              customColumns={customTableColumns({
                                theme,
                                userProjectIds,
                                fenceAcls: fencesAllAcls,
                              })}
                              filterInputPlaceholder={'Filter table'}
                              columnDropdownText="Columns"
                              fieldTypesForFilter={['text', 'keyword', 'id']}
                              maxPagesOptions={5}
                              onFilterChange={(val) => {
                                if (val !== '') {
                                  trackFileRepoInteraction({
                                    category: TRACKING_EVENTS.categories.fileRepo.dataTable,
                                    action: TRACKING_EVENTS.actions.filter,
                                    label: val,
                                  });
                                }
                                if (props.onFilterChange) {
                                  props.onFilterChange(val);
                                }
                              }}
                              onTableExport={({ files }) => {
                                trackFileRepoInteraction({
                                  category: TRACKING_EVENTS.categories.fileRepo.dataTable,
                                  action: 'Export TSV',
                                  label: files,
                                });
                              }}
                              exportTSVText={
                                <>
                                  <DownloadIcon
                                    fill={theme.greyScale3}
                                    width={12}
                                    height={18}
                                    style={{ marginRight: '9px' }}
                                  />
                                  {'Export TSV'}
                                </>
                              }
                            />
                          </Column>
                        </Column>
                      </Layout>
                    </>
                  );
                }}
              />
            )
          }
        />
      )}
    />
  );
};

FileRepo.propTypes = {
  state: PropTypes.object.isRequired,
  effects: PropTypes.object.isRequired,
  gen3User: PropTypes.object,
  openModalId: PropTypes.string,
  userProjectIds: PropTypes.array,
  isConnectedToCavatica: PropTypes.bool.isRequired,
  translateSQONValue: PropTypes.func,
  closeModal: PropTypes.func.isRequired,
  openModal: PropTypes.func.isRequired,
  graphqlField: PropTypes.string,
  selectedTableRows: PropTypes.array,
  api: PropTypes.func,
  onFilterChange: PropTypes.func,
};

export default enhance(FileRepo);
