import * as React from 'react';
import { compose } from 'recompose';
import _ from 'lodash';

import styled from 'react-emotion';
import Row from 'uikit/Row';
import Column from 'uikit/Column';

import { withApi } from 'services/api';
import {
  EntityTitleBar,
  EntityTitle,
  EntityActionBar,
  EntityContent,
  EntityContentSection,
  EntityContentDivider,
} from 'components/EntityPage';

import ArrangerDataProvider from 'components/ArrangerDataProvider';
import { buildSqonForIds } from 'services/arranger';

import BaseDataTable from 'uikit/DataTable';
import { mockColumns, mockData } from './mock';

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
          experiment_strategies
          external_id
          file_format
          file_name
          instrument_models
          is_harmonized
          is_paired_end
          kf_id
          latest_did
          modified_at
          platforms
          reference_genome
          size
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
                  biospecimens {
                    hits {
                      edges {
                        node {
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
                    ancestral_hpo_ids
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

const FileEntity = ({ api, fileId }) => {
  return (
    <ArrangerDataProvider
      api={api}
      query={fileQuery}
      sqon={buildSqonForIds([fileId])}
      transform={data => _.get(data, 'data.file.hits.edges[0].node')}
    >
      {file => (
        <Container>
          <EntityTitleBar>
            <EntityTitle
              icon="file"
              title={fileId}
              tags={file.isLoading || true ? [] : getTags(file.data)}
            />
          </EntityTitleBar>
          <EntityActionBar>Share Button</EntityActionBar>
          <EntityContent>
            <EntityContentSection title="File Properties">
              <Row style={{ width: '100%' }}>
                <Column style={{ flex: 1, paddingRight: 15, border: 1 }}>Summary Table 1</Column>
                <Column style={{ flex: 1, paddingLeft: 15, border: 1 }}>Summary Table 2</Column>
              </Row>
            </EntityContentSection>
            <EntityContentDivider />
            <EntityContentSection title="Associated Participants/Biospecimens">
              Participant and Biospeciment Table Here
              <BaseDataTable
                columns={mockColumns.map(col => ({ ...col, ...{ show: true } }))}
                loading={false}
                data={mockData}
              />
            </EntityContentSection>
            <EntityContentDivider />
            <EntityContentSection title="Associated Experimental Strategies">
              Experimental Strategy Table Here
            </EntityContentSection>
            <EntityContentDivider />
            <EntityContentSection title="Sequencing Read Properties">
              Read Property Numbers Here
            </EntityContentSection>
          </EntityContent>
        </Container>
      )}
    </ArrangerDataProvider>
  );
};

const enhance = compose(withApi);

export default enhance(FileEntity);
