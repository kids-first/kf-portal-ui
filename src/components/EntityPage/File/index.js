import React, { useState, useEffect } from 'react';
import isNull from 'lodash/isNull';
import isUndefined from 'lodash/isUndefined';
import get from 'lodash/get';

import Row from 'uikit/Row';
import Column from 'uikit/Column';
import SummaryTable from 'uikit/SummaryTable';
import BaseDataTable from 'uikit/DataTable';
import { InfoBoxRow } from 'uikit/InfoBox';
import ExternalLink from 'uikit/ExternalLink';
import { Link } from 'uikit/Core';
import GenericErrorDisplay from 'uikit/GenericErrorDisplay';

import { trackUserInteraction, TRACKING_EVENTS } from 'services/analyticsTracking';
import { kfWebRoot } from 'common/injectGlobals';
import { FENCES } from 'common/constants';

import {
  EntityTitleBar,
  EntityTitle,
  EntityActionBar,
  EntityContent,
  EntityContentSection,
  EntityContentDivider,
} from 'components/EntityPage';

import { buildSqonForIds } from 'services/arranger';

import ArrangerDataProvider from 'components/ArrangerDataProvider';

import {
  particpantBiospecimenColumns,
  toParticpantBiospecimenData,
} from './participantBiospecimenTable';

import {
  experimentalStrategiesColumns,
  toExperimentalStrategiesData,
} from './experimentalStrategies';

import { fileQuery, toFilePropertiesSummary } from './fileProperties';
import { hasSequencingReadProperties, toSequencingReadProperties } from './sequencingProperties';

import CavaticaAnalyse from './CavaticaAnalyse';
import Download from './Download';
import ShareButton from 'uikit/ShareButton';
import { checkUserFilePermission } from 'services/fileAccessControl';
import { FILE_VIEW } from 'common/constants';

import '../EntityPage.css';
import { Spinner } from 'uikit/Spinner';
import PropTypes from 'prop-types';
import { fillCenter } from 'theme/tempTheme.module.css';
// file types
const FILE_TYPE_BAM = 'bam';
const FILE_TYPE_CRAM = 'cram';

const getTags = (data) => {
  const dataType = data.data_type;
  const experimentalStrategies = Array.from(new Set(get(data, 'experiment_strategies', [])));
  return [dataType, experimentalStrategies].filter((item) => !(isNull(item) || isUndefined(item)));
};

const DisplayLoader = () => <Spinner className={fillCenter} size={'large'} />;

const FileEntity = ({ api, fileId }) => {
  const [isPageLoading, setPageLoading] = useState(true);
  const [hasFilePermission, setUserFilePermission] = useState(null);

  useEffect(() => {
    // Need to check all fences
    const hasUserPermissionPromises = FENCES.map((fence) =>
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

        return (
          <Column className="entityPage-container">
            <EntityTitleBar>
              <EntityTitle icon="file" title={fileId} tags={file.isLoading ? [] : getTags(data)} />
            </EntityTitleBar>
            <EntityActionBar>
              <CavaticaAnalyse
                fileId={fileId}
                disabled={!hasFilePermission}
                hasFilePermission={hasFilePermission}
                file={{
                  acl: data.acl,
                  latest_did: data.latest_did,
                  repository: data.repository,
                }}
                sourceLocation={FILE_VIEW}
              />
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
};

export default FileEntity;
