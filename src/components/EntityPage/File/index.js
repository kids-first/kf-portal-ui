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

import SummaryTable from 'uikit/SummaryTable';

import ArrangerDataProvider from 'components/ArrangerDataProvider';
import { buildSqonForIds } from 'services/arranger';

import ExternalLink from 'uikit/ExternalLink';

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

const filePropertiesSummary = data => {
  console.log('filePropertiesSummary', data);
  const participants = data.participants.hits.edges[0].node;
  const study = participants.study;
  const biospecimens = participants.biospecimens.hits.edges[0].node;
  return [
    {
      title: 'External ID:',
      summary: <ExternalLink href={``}>{data.external_id}</ExternalLink>,
    },
    { title: 'Name:', summary: data.file_name },
    { title: 'Study:', summary: `${study.short_name}(${study.kf_id})` },
    { title: 'Access:', summary: data.controlled_access ? 'Controlled' : '' },
    { title: 'Consent Codes:', summary: biospecimens.dbgap_consent_code },
    {
      title: 'Harmonized Data:',
      summary: data.is_harmonized ? 'Yes' : 'No',
    },
    { title: 'Reference Genome:', summary: data.reference_genome },
    {
      title: 'Experimental Strategy:',
      summary: data.experiment_strategies.map(strategies => <div>{strategies}</div>),
    },
    { title: 'Data Type:', summary: data.data_type },
    { title: 'File Format:', summary: data.file_format },
    { title: 'Size:', summary: formatToGB(data.size) },
  ];
};

const formatToGB = size => `${size / 1000000} GB`; // TODO: What size is coming back from API?

const particpantBiospecimenColumns = [
  { Header: 'Participant ID', accessor: 'participant_id' },
  { Header: 'External ID', accessor: 'external_id' },
  { Header: 'Study Name', accessor: 'study_name' },
  { Header: 'Proband', accessor: 'proband' },
  { Header: 'Biospecimen ID', accessor: 'biospecimen_id' },
  { Header: 'Analyte Type', accessor: 'analyte_type' },
  { Header: 'Tissue Type', accessor: 'tissue_type' },
  { Header: 'Age at Sample Acquisition', accessor: 'age_at_sample_acquisition' },
];

const particpantBiospecimenData = data =>
  _.flattenDeep(
    data.participants.hits.edges.map(nodes => {
      const p = nodes.node;

      return p.biospecimens.hits.edges.map(bio => {
        const biospecimen = bio.node;
        return {
          participant_id: p.kf_id,
          external_id: p.external_id,
          study_name: '',
          proband: p.is_proband ? 'Yes' : 'No,',
          biospecimen_id: '--',
          analyte_type: biospecimen.analyte_type,
          tissue_type: biospecimen.source_text_tissue_type,
          age_at_sample_acquisition: '--',
        };
      });
    }),
  );

const experimentalStrategiesColumns = [
  { Header: 'Experimental Strategy', accessor: 'experimental_strategy' },
  { Header: 'External ID', accessor: 'external_id' },
  { Header: 'Experiment Date', accessor: 'experiment_date' },
  { Header: 'Instrument Model', accessor: 'instrument_model' },
  { Header: 'Platform', accessor: 'platform' },
  { Header: 'Library Name', accessor: 'library_name' },
  { Header: 'Library Strand', accessor: 'library_strand' },
];

const experimentalStrategiesData = () => [
  {
    experiment_strategy: '--',
    external_id: '--',
    experiment_date: '--',
    instrument_model: '--',
    platform: '--',
    library_name: '--',
    library_strand: '--',
  },
];

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
      {file => {
        if (file.isLoading) {
          return <div>Loading</div>;
        } else if (!file.data) {
          return <div>no data</div>;
        } else {
          // split file properties data into two arrays for two tables
          const fileProperties = filePropertiesSummary(file.data);
          const [table1, table2] = _.chunk(fileProperties, fileProperties.length / 2);

          return (
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
                    <Column style={{ flex: 1, paddingRight: 15, border: 1 }}>
                      <SummaryTable rows={table1} />
                    </Column>
                    <Column style={{ flex: 1, paddingLeft: 15, border: 1 }}>
                      <SummaryTable rows={table2} />
                    </Column>
                  </Row>
                </EntityContentSection>
                <EntityContentDivider />
                <EntityContentSection title="Associated Participants/Biospecimens">
                  <BaseDataTable
                    loading={file.isLoading}
                    data={particpantBiospecimenData(file.data)}
                    columns={particpantBiospecimenColumns}
                  />
                </EntityContentSection>
                <EntityContentDivider />
                <EntityContentSection title="Associated Experimental Strategies">
                  <BaseDataTable
                    loading={file.isLoading}
                    data={experimentalStrategiesData(file.data)}
                    columns={experimentalStrategiesColumns}
                  />
                </EntityContentSection>
                <EntityContentDivider />
                <EntityContentSection title="Sequencing Read Properties">
                  Read Property Numbers Here
                </EntityContentSection>
              </EntityContent>
            </Container>
          );
        }
      }}
    </ArrangerDataProvider>
  );
};

const enhance = compose(withApi);

export default enhance(FileEntity);
