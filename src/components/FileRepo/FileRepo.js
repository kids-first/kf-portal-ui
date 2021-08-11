import React from 'react';
import FilterIcon from 'react-icons/lib/fa/filter';
import { connect } from 'react-redux';
import { BarChartOutlined } from '@ant-design/icons';
import { Arranger, CurrentSQON, Table } from '@kfarranger/components/dist/Arranger';
import { replaceSQON } from '@kfarranger/components/dist/SQONView/utils';
import { Button, Layout, Spin } from 'antd';
import isObject from 'lodash/isObject';
import PropTypes from 'prop-types';
import { compose } from 'recompose';

import { arrangerProjectId } from 'common/injectGlobals';
import ArrangerConnectionGuard from 'components/ArrangerConnectionGuard';
import CavaticaConnectModal from 'components/cavatica/CavaticaConnectModal';
import CavaticaCopyMultipleFilesModal from 'components/cavatica/CavaticaCopyMultipleFilesModal';
import AggregationSidebar from 'components/FileRepo/AggregationSidebar';
import SaveQuery from 'components/LoadShareSaveDeleteQuery/SaveQuery';
import ShareQuery from 'components/LoadShareSaveDeleteQuery/ShareQuery';
import SQONURL from 'components/SQONURL';
import { FileRepoStatsQuery } from 'components/Stats';
import useCavatica from 'hooks/useCavatica';
import useFenceConnections from 'hooks/useFenceConnections';
import useUser from 'hooks/useUser';
import DownloadIcon from 'icons/DownloadIcon';
import { TRACKING_EVENTS, trackUserInteraction } from 'services/analyticsTracking';
import { withApi } from 'services/api';
import { closeModal, openModal } from 'store/actions/modal';
import { AllFencesNames } from 'store/fenceTypes';
import { selectModalId } from 'store/selectors/modal';
import { selectUser } from 'store/selectors/users';
import theme from 'theme/defaultTheme';
import { fillCenter } from 'theme/tempTheme.module.css';
import Column from 'uikit/Column';
import { FilterInput } from 'uikit/Input';
import Row from 'uikit/Row';
import { Spinner } from 'uikit/Spinner';
import Tooltip from 'uikit/Tooltip';

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
  user: selectUser(state),
  openModalId: selectModalId(state),
});

const mapDispatchToProps = (dispatch) => ({
  openModal: (id) => dispatch(openModal(id)),
  closeModal: (id) => dispatch(closeModal(id)),
});

const connector = connect(mapStateToProps, mapDispatchToProps);

const enhance = compose(connector, withApi);

const FileRepo = ({
  gen3User,
  translateSQONValue = () => 'Uploaded List',
  userProjectIds = gen3User ? Object.keys(gen3User.projects) : [],
  openModalId,
  closeModal,
  openModal,
  ...props
}) => {
  const { user } = useUser();
  const { isConnected: isConnectedToCavatica } = useCavatica();
  const {
    //needed in order to avoid rendering the main component on mount before fetching fences.
    loadingFences,
    fenceConnections,
    fencesAllAcls,
  } = useFenceConnections(props.api, AllFencesNames);

  if (loadingFences.length > 0) {
    return <Spinner size={'large'} />;
  }
  return (
    <SQONURL
      render={(url) => (
        <ArrangerConnectionGuard
          api={props.api}
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
                api={props.api}
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
                          user={user}
                          fenceConnections={fenceConnections}
                          api={props.api}
                        />
                      )}
                      <Layout className="arranger-container">
                        <AggregationSidebar
                          {...{ ...props, ...url, translateSQONValue }}
                          trackFileRepoInteraction={trackFileRepoInteraction}
                        />
                        <Column className="arranger-table-container">
                          <Row mb={url.sqon ? 3 : 0}>
                            <CurrentSQON
                              {...props}
                              {...url}
                              {...{ translateSQONValue }}
                              api={props.api}
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
                                api={props.api}
                                render={({ data: stats, loading: disabled }) => (
                                  <Row className="querySharing-container">
                                    <SaveShareButtonContainer>
                                      <ShareQuery
                                        api={props.api}
                                        url={url}
                                        stats={stats}
                                        disabled={!!disabled}
                                        user={user}
                                        sqon={url.sqon}
                                      />
                                    </SaveShareButtonContainer>
                                    <SaveShareButtonContainer>
                                      <SaveQuery
                                        api={props.api}
                                        url={url}
                                        stats={stats}
                                        disabled={!!disabled}
                                        user={user}
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
  gen3User: PropTypes.object,
  openModalId: PropTypes.string,
  userProjectIds: PropTypes.array,
  translateSQONValue: PropTypes.func,
  closeModal: PropTypes.func.isRequired,
  openModal: PropTypes.func.isRequired,
  graphqlField: PropTypes.string,
  selectedTableRows: PropTypes.array,
  api: PropTypes.func,
  onFilterChange: PropTypes.func,
  user: PropTypes.object,
};

export default enhance(FileRepo);
