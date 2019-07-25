import * as React from 'react';
import { compose, lifecycle, withState } from 'recompose';
import styled, { css } from 'react-emotion';
import { withTheme } from 'emotion-theming';
import _ from 'lodash';
import Row from 'uikit/Row';
import Column from 'uikit/Column';
import SummaryTable from 'uikit/SummaryTable';
import BaseDataTable from 'uikit/DataTable';
import { InfoBoxRow } from 'uikit/InfoBox';
import ExternalLink from 'uikit/ExternalLink';
import LoadingSpinner from 'uikit/LoadingSpinner';
import { Link } from 'uikit/Core';
import { trackUserInteraction, TRACKING_EVENTS } from 'services/analyticsTracking';
import { kfWebRoot } from 'common/injectGlobals';
import { GEN3 } from 'common/constants';

import {
  EntityTitleBar,
  EntityTitle,
  EntityActionBar,
  EntityContent,
  EntityContentSection,
  EntityContentDivider,
} from 'components/EntityPage';

import { withApi } from 'services/api';
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

import { toFilePropertiesSummary } from './fileProperties';
import { hasSequencingReadProperties, toSequencingReadProperties } from './sequencingProperties';

import CavaticaAnalyse from './CavaticaAnalyse';
import Download from './Download';
import ShareButton from 'uikit/ShareButton';
import { checkUserFilePermission } from 'services/fileAccessControl';

// file types
const FILE_TYPE_BAM = 'bam';
const FILE_TYPE_CRAM = 'cram';

const fileQuery = `query ($sqon: JSON) {
  file {
    hits(filters: $sqon) {
      edges {
        node {
          kf_id
          acl
          availability
          controlled_access
          created_at
          data_type
          external_id
          file_format
          file_name
          is_harmonized
          latest_did
          modified_at
          reference_genome
          repository
          size
          sequencing_experiments {
            hits {
              edges {
                node {
                  max_insert_size
                  total_reads
                  mean_depth
                  mean_insert_size
                  mean_read_length
                  experiment_strategy
                  external_id
                  experiment_date
                  instrument_model
                  platform
                  library_name
                  library_strand
                }
              }
            }
          }
          participants {
            hits {
              edges {
                node {
                  kf_id
                  affected_status
                  alias_group
                  ethnicity
                  external_id
                  family_id
                  gender
                  is_proband
                  race
                  study {
                    short_name
                  }
                  biospecimens {
                    hits {
                      edges {
                        node {
                          kf_id
                          age_at_event_days
                          analyte_type
                          composition
                          concentration_mg_per_ml
                          consent_type
                          dbgap_consent_code
                          external_aliquot_id
                          external_sample_id
                          method_of_sample_procurement
                          ncit_id_anatomical_site
                          ncit_id_tissue_type
                          sequencing_center_id
                          shipment_date
                          shipment_origin
                          source_text_anatomical_site
                          source_text_tissue_type
                          source_text_tumor_descriptor
                          spatial_descriptor
                          uberon_id_anatomical_site
                          volume_ul
                        }
                      }
                    }
                  }
                  diagnoses {
                    hits {
                      edges {
                        node {
                          age_at_event_days
                          diagnosis_category
                          diagnosis
                          external_id
                          icd_id_diagnosis
                          mondo_id_diagnosis
                          ncit_id_diagnosis
                          source_text_diagnosis
                          source_text_tumor_location
                          spatial_descriptor
                          uberon_id_tumor_location
                        }
                      }
                    }
                  }
                  family {
                    family_compositions {
                      hits {
                        edges {
                          node {
                            shared_hpo_ids
                            family_members {
                              hits {
                                edges {
                                  node {
                                    affected_status
                                    diagnosis_category
                                    ethnicity
                                    external_id
                                    gender
                                    race
                                    relationship
                                    diagnoses {
                                      hits {
                                        edges {
                                          node {
                                            age_at_event_days
                                            diagnosis_category
                                            diagnosis
                                            external_id
                                            icd_id_diagnosis
                                            mondo_id_diagnosis
                                            ncit_id_diagnosis
                                            source_text_diagnosis
                                            source_text_tumor_location
                                            spatial_descriptor
                                            uberon_id_tumor_location
                                          }
                                        }
                                      }
                                    }
                                    outcome {
                                      age_at_event_days
                                      disease_related
                                      external_id
                                      vital_status
                                    }
                                    phenotype {
                                      age_at_event_days
                                      external_id
                                      hpo_phenotype_not_observed
                                      hpo_phenotype_observed
                                      hpo_phenotype_observed_text
                                      shared_hpo_ids
                                      snomed_phenotype_not_observed
                                      snomed_phenotype_observed
                                      source_text_phenotype
                                    }
                                  }
                                }
                              }
                            }
                          }
                        }
                      }
                    }
                  }
                  outcome {
                    age_at_event_days
                    disease_related
                    external_id
                    vital_status
                  }
                  phenotype {
                    age_at_event_days
                    external_id
                    hpo_phenotype_not_observed
                    hpo_phenotype_observed
                    hpo_phenotype_observed_text
                    snomed_phenotype_not_observed
                    snomed_phenotype_observed
                    source_text_phenotype
                  }
                  study {
                    attribution
                    data_access_authority
                    external_id
                    investigator_id
                    kf_id
                    name
                    release_status
                    short_name
                    version
                  }
                }
              }
            }
          }
        }
      }
    }
  }
}`;

const getTags = data => {
  const dataType = data.data_type;
  const experimentalStrategies = Array.from(new Set(_.get(data, 'experiment_strategies', [])));

  return [dataType, experimentalStrategies].filter(
    item => !(_.isNull(item) || _.isUndefined(item)),
  );
};

const Container = styled(Column)`
  flex-direction: column;
  height: 100%;
  width: 100%;
  align-items: center;
`;

const FileEntity = compose(withTheme)(
  ({ api, fileId, isPageLoading, hasFilePermission, theme }) => (
    <ArrangerDataProvider
      api={api}
      query={fileQuery}
      sqon={buildSqonForIds([fileId])}
      transform={data => _.get(data, 'data.file')}
    >
      {file => {
        if (file.isLoading || isPageLoading) {
          return (
            <div className={theme.fillCenter} style={{ marginTop: '31px' }}>
              <LoadingSpinner color={theme.greyScale11} size={'50px'} />
            </div>
          );
        }

        const data = _.get(file, 'data.hits.edges[0].node');
        const fileType = data.file_format;

        return (
          <Container>
            <EntityTitleBar>
              <EntityTitle icon="file" title={fileId} tags={file.isLoading ? [] : getTags(data)} />
            </EntityTitleBar>
            <EntityActionBar>
              <CavaticaAnalyse fileId={fileId} disabled={!hasFilePermission} />
              <Download
                onSuccess={url => {
                  trackUserInteraction({
                    category: TRACKING_EVENTS.categories.entityPage.file,
                    action: 'Download File',
                    label: url,
                  });
                }}
                onError={err => {
                  trackUserInteraction({
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
                <Row
                  className={css`
                    width: '100%';
                  `}
                >
                  <SummaryTable rows={toFilePropertiesSummary(data)} rowMax={6} />
                </Row>
              </EntityContentSection>
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
                    study_name: studyShortName => (
                      <ExternalLink
                        href={`${kfWebRoot}/support/studies-and-access`}
                        onClick={e => {
                          trackUserInteraction({
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

                    participant_id: participantId => (
                      <Link to={`/participant/${participantId}#summary`}>
                        {participantId}
                      </Link>
                    ),

                  }}
                  columns={particpantBiospecimenColumns}
                  downloadName="participants_biospecimens"
                />
              </EntityContentSection>

              {hasSequencingReadProperties(data) ? (
                <React.Fragment>
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
                </React.Fragment>
              ) : null}

              {(fileType === FILE_TYPE_CRAM || fileType === FILE_TYPE_BAM) &&
              hasSequencingReadProperties(data) ? (
                <React.Fragment>
                  <EntityContentDivider />
                  <EntityContentSection title="Sequencing Read Properties">
                    <InfoBoxRow data={toSequencingReadProperties(data)} />
                  </EntityContentSection>
                </React.Fragment>
              ) : null}
            </EntityContent>
          </Container>
        );
      }}
    </ArrangerDataProvider>
  ),
);

const enhance = compose(
  withApi,
  withState('isPageLoading', 'setPageLoading', true),
  withState('hasFilePermission', 'setUserFilePermission', null),
  lifecycle({
    async componentDidMount() {
      const { api, fileId, setPageLoading, setUserFilePermission } = this.props;
      // TODO: Need to update this to check all fences
      const hasFilePermission = await checkUserFilePermission(api)({ fileId, fence: GEN3 });
      setUserFilePermission(hasFilePermission);
      setPageLoading(false);
    },
  }),
);

export default enhance(FileEntity);
