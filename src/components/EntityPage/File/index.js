import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import { BarChartOutlined } from '@ant-design/icons';
import { Button } from 'antd';
import get from 'lodash/get';
import isNull from 'lodash/isNull';
import isUndefined from 'lodash/isUndefined';
import PropTypes from 'prop-types';
import { compose } from 'recompose';

import { kfWebRoot } from 'common/injectGlobals';
import ArrangerDataProvider from 'components/ArrangerDataProvider';
import CavaticaConnectModal from 'components/cavatica/CavaticaConnectModal';
import CavaticaCopyOpenAccessFileModal from 'components/cavatica/CavaticaCopyOpenAccessFileModal';
import {
  EntityActionBar,
  EntityContent,
  EntityContentDivider,
  EntityContentSection,
  EntityTitle,
  EntityTitleBar,
} from 'components/EntityPage';
import { TRACKING_EVENTS, trackUserInteraction } from 'services/analyticsTracking';
import { withApi } from 'services/api';
import { buildSqonForIds } from 'services/arranger';
import { checkUserFilePermission } from 'services/fileAccessControl';
import { closeModal, openModal } from 'store/actions/modal';
import { AllFencesNames } from 'store/fenceTypes';
import { selectIsConnected } from 'store/selectors/cavatica';
import { selectModalId } from 'store/selectors/modal';
import { fillCenter } from 'theme/tempTheme.module.css';
import Column from 'uikit/Column';
import { Link } from 'uikit/Core';
import BaseDataTable from 'uikit/DataTable';
import ExternalLink from 'uikit/ExternalLink';
import GenericErrorDisplay from 'uikit/GenericErrorDisplay';
import { InfoBoxRow } from 'uikit/InfoBox';
import Row from 'uikit/Row';
import ShareButton from 'uikit/ShareButton';
import { Spinner } from 'uikit/Spinner';
import SummaryTable from 'uikit/SummaryTable';

import Download from './Download';
import {
  experimentalStrategiesColumns,
  toExperimentalStrategiesData,
} from './experimentalStrategies';
import { fileQuery, toFilePropertiesSummary } from './fileProperties';
import {
  particpantBiospecimenColumns,
  toParticpantBiospecimenData,
} from './participantBiospecimenTable';
import { hasSequencingReadProperties, toSequencingReadProperties } from './sequencingProperties';

import '../EntityPage.css';

const mapStateToProps = (state) => ({
  openModalId: selectModalId(state),
  isConnectedToCavatica: selectIsConnected(state),
});

const mapDispatchToProps = (dispatch) => ({
  openModal: (id) => dispatch(openModal(id)),
  closeModal: (id) => dispatch(closeModal(id)),
});

const connector = connect(mapStateToProps, mapDispatchToProps);

// file types
const FILE_TYPE_BAM = 'bam';
const FILE_TYPE_CRAM = 'cram';

const CAVATICA_CONNECT_FILE_MODAL_ID = 'CAVATICA_CONNECT_FILE_MODAL_ID';
const CAVATICA_COPY_FILE_MODAL_ID = 'CAVATICA_COPY_FILE_MODAL_ID';

const getTags = (data) => {
  const dataType = data.data_type;
  const experimentalStrategies = Array.from(new Set(get(data, 'experiment_strategies', [])));
  return [dataType, experimentalStrategies].filter((item) => !(isNull(item) || isUndefined(item)));
};

const DisplayLoader = () => <Spinner className={fillCenter} size={'large'} />;

const FileEntity = ({ api, fileId, openModalId, closeModal, openModal, isConnectedToCavatica }) => {
  const [isPageLoading, setPageLoading] = useState(true);
  const [hasFilePermission, setUserFilePermission] = useState(null);

  useEffect(() => {
    // Need to check all fences
    const hasUserPermissionPromises = AllFencesNames.map((fence) =>
      checkUserFilePermission(api)({ fileId, fence }),
    );
    // A user has access if at least one fence grants us access
    Promise.all(hasUserPermissionPromises).then((accesses) => {
      const userHasAtLeastOneFileAccess = accesses.some((hasAccess) => hasAccess);
      setUserFilePermission(userHasAtLeastOneFileAccess);
      setPageLoading(false);
    });
  }, [setUserFilePermission, setPageLoading, fileId, api]);

  if (isPageLoading) {
    return <DisplayLoader />;
  }

  const showConnectModal = openModalId === CAVATICA_CONNECT_FILE_MODAL_ID;
  const showCavaticaCopyModal = openModalId === CAVATICA_COPY_FILE_MODAL_ID;
  return (
    <ArrangerDataProvider
      api={api}
      query={fileQuery}
      sqon={buildSqonForIds([fileId])}
      transform={(data) => get(data, 'data.file')}
    >
      {(file) => {
        if (file.isLoading) {
          return <DisplayLoader />;
        }

        const data = get(file, 'data.hits.edges[0].node', null);

        if (data === null) {
          return (
            <Column className="entityPage-container" style={{ justifyContent: 'center' }}>
              <GenericErrorDisplay error={'FILE NOT FOUND'} />
            </Column>
          );
        }

        const fileType = data.file_format;

        const hasParticipants =
          Object.keys(get(data, 'participants.hits.edges[0].node', {})).length > 0;

        const onCloseCavaticaCopyModal = () => closeModal(CAVATICA_COPY_FILE_MODAL_ID);

        return (
          <Column className="entityPage-container">
            <EntityTitleBar>
              <EntityTitle icon="file" title={fileId} tags={file.isLoading ? [] : getTags(data)} />
            </EntityTitleBar>
            <EntityActionBar>
              <div
                style={{
                  width: 'auto',
                  marginRight: '10px',
                }}
              >
                {showConnectModal && (
                  <CavaticaConnectModal
                    isVisible={showConnectModal}
                    onComplete={() => {
                      closeModal(CAVATICA_CONNECT_FILE_MODAL_ID);
                      openModal(CAVATICA_COPY_FILE_MODAL_ID);
                    }}
                    onCancelCB={() => closeModal(CAVATICA_CONNECT_FILE_MODAL_ID)}
                  />
                )}
                {showCavaticaCopyModal && (
                  <CavaticaCopyOpenAccessFileModal
                    fileId={fileId}
                    onCancel={onCloseCavaticaCopyModal}
                    onComplete={onCloseCavaticaCopyModal}
                    file={{
                      acl: data.acl,
                      latest_did: data.latest_did,
                      repository: data.repository,
                    }}
                  />
                )}
                <Button
                  type={'primary'}
                  icon={<BarChartOutlined />}
                  disabled={!hasFilePermission}
                  onClick={() =>
                    openModal(
                      isConnectedToCavatica
                        ? CAVATICA_COPY_FILE_MODAL_ID
                        : CAVATICA_CONNECT_FILE_MODAL_ID,
                    )
                  }
                >
                  Analyse in Cavatica
                </Button>
              </div>
              <Download
                onSuccess={async (url) => {
                  await trackUserInteraction({
                    category: TRACKING_EVENTS.categories.entityPage.file,
                    action: 'Download File',
                    label: url,
                  });
                }}
                onError={async (err) => {
                  await trackUserInteraction({
                    category: TRACKING_EVENTS.categories.entityPage.file,
                    action: 'Download File FAILED',
                    label: JSON.stringify(err, null, 2),
                  });
                }}
                kfId={data.kf_id}
                fence={data.repository}
                disabled={!hasFilePermission}
              />
              <ShareButton link={window.location.href} />
            </EntityActionBar>

            <EntityContent>
              <EntityContentSection title="File Properties">
                <Row style={{ width: '100%' }}>
                  <SummaryTable rows={toFilePropertiesSummary(data)} rowMax={6} />
                </Row>
              </EntityContentSection>

              {hasParticipants && (
                <>
                  <EntityContentDivider />
                  <EntityContentSection title="Associated Participants/Biospecimens">
                    <BaseDataTable
                      analyticsTracking={{
                        title: 'Associated Participants/Biospecimens',
                        category: TRACKING_EVENTS.categories.entityPage.file,
                      }}
                      loading={file.isLoading}
                      data={toParticpantBiospecimenData(data)}
                      transforms={{
                        // eslint-disable-next-line react/display-name
                        study_name: (studyShortName) => (
                          <ExternalLink
                            href={`${kfWebRoot}/support/studies-and-access`}
                            onClick={async () => {
                              await trackUserInteraction({
                                category: TRACKING_EVENTS.categories.entityPage.file,
                                action:
                                  TRACKING_EVENTS.actions.click +
                                  `: Associated Participants/Biospecimens: Study Name`,
                                label: studyShortName,
                              });
                            }}
                          >
                            {studyShortName}
                          </ExternalLink>
                        ),

                        // eslint-disable-next-line react/display-name
                        participant_id: (participantId) => (
                          <Link to={`/participant/${participantId}#summary`}>{participantId}</Link>
                        ),
                      }}
                      columns={particpantBiospecimenColumns}
                      downloadName="participants_biospecimens"
                    />
                  </EntityContentSection>
                </>
              )}
              {hasSequencingReadProperties(data) && (
                <>
                  <EntityContentDivider />
                  <EntityContentSection title="Associated Experimental Strategies">
                    <BaseDataTable
                      analyticsTracking={{
                        title: 'Associated Experimental Strategies',
                        category: TRACKING_EVENTS.categories.entityPage.file,
                      }}
                      loading={file.isLoading}
                      data={toExperimentalStrategiesData(data)}
                      columns={experimentalStrategiesColumns}
                      downloadName="experimental_strategies"
                    />
                  </EntityContentSection>
                </>
              )}

              {(fileType === FILE_TYPE_CRAM || fileType === FILE_TYPE_BAM) &&
                hasSequencingReadProperties(data) && (
                  <>
                    <EntityContentDivider />
                    <EntityContentSection title="Sequencing Read Properties">
                      <InfoBoxRow data={toSequencingReadProperties(data)} />
                    </EntityContentSection>
                  </>
                )}
            </EntityContent>
          </Column>
        );
      }}
    </ArrangerDataProvider>
  );
};

FileEntity.propTypes = {
  api: PropTypes.func,
  fileId: PropTypes.string,
  openModalId: PropTypes.string,
  closeModal: PropTypes.func,
  openModal: PropTypes.func,
  isConnectedToCavatica: PropTypes.bool,
};

export default compose(withApi, connector)(FileEntity);
