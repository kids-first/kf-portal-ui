import React from 'react';
import uniq from 'lodash/uniq';
import { pickData } from './utils';
import { formatBytesToHumanReadable } from './utils';
import { trackUserInteraction, TRACKING_EVENTS } from 'services/analyticsTracking';
import { kfWebRoot } from 'common/injectGlobals';

import ExternalLink from 'uikit/ExternalLink';
import { DB_GA_P, generateUrlForDbGap } from 'common/constants';

export const fileQuery = `query ($sqon: JSON) {
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
                                      hits {
                                        edges {
                                          node {
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
                    hits {
                      edges {
                        node {
                          age_at_event_days
                          external_id
                          hpo_phenotype_not_observed
                          hpo_phenotype_observed
                          hpo_phenotype_observed_text
                          snomed_phenotype_not_observed
                          snomed_phenotype_observed
                          source_text_phenotype
                        }
                      }
                    }
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

const buildParticipantsTableConfigs = (participantNode) => {
  if (!participantNode) {
    return [];
  }

  const study = participantNode.study;
  let rows = [
    {
      title: 'Study:',
      summary: study ? (
        <ExternalLink
          href={`${kfWebRoot}/support/studies-and-access`}
          onClick={async () => {
            await trackUserInteraction({
              category: TRACKING_EVENTS.categories.entityPage.file,
              action: TRACKING_EVENTS.actions.click + `: File Property: Study`,
              label: `${study.short_name} (${study.kf_id})`,
            });
          }}
        >
          {`${study.short_name} (${study.kf_id})`}
        </ExternalLink>
      ) : (
        '--'
      ),
    },
  ];

  const studyExternalId = study.external_id;
  const studyDbGaP = study.data_access_authority;
  if (DB_GA_P === studyDbGaP) {
    rows = [
      ...rows,
      {
        title: 'dbGaP Accession Number',
        summary: (
          <ExternalLink
            href={generateUrlForDbGap(studyExternalId)}
            onClick={async () => {
              await trackUserInteraction({
                category: TRACKING_EVENTS.categories.entityPage.file,
                action: `${TRACKING_EVENTS.actions.click}: DbGaP link`,
                label: `${studyDbGaP} (${studyExternalId})`,
              });
            }}
          >
            {studyExternalId}
          </ExternalLink>
        ),
      },
    ];
  }

  const biospecimenNode = pickData(participantNode, 'biospecimens.hits.edges[0].node');
  rows = [
    ...rows,
    { title: 'Consent Codes:', summary: pickData(biospecimenNode, 'dbgap_consent_code') },
  ];
  return rows;
};

export const toFilePropertiesSummary = (data) => {
  const participantNode = pickData(data, 'participants.hits.edges[0].node');

  const experimentalStrategies =
    uniq(
      data.sequencing_experiments.hits.edges
        .filter((edge) => edge.node && edge.node.experiment_strategy)
        .map((edge) => edge.node.experiment_strategy),
    ).join(', ') || '--';

  const controlledAccess =
    data.controlled_access === null || data.controlled_access === undefined
      ? '--'
      : data.controlled_access
      ? 'Controlled'
      : 'Open';
  return [
    { title: 'Kids First ID:', summary: pickData(data, 'kf_id') },
    { title: 'Name:', summary: pickData(data, 'file_name') },
    ...buildParticipantsTableConfigs(participantNode),
    { title: 'Access:', summary: controlledAccess },

    {
      title: 'External ID:',
      summary: pickData(data, 'external_id'),
    },
    {
      title: 'Harmonized Data:',
      summary: data.is_harmonized ? 'Yes' : 'No',
    },
    { title: 'Reference Genome:', summary: pickData(data, 'reference_genome') },
    {
      title: 'Experimental Strategy:',
      summary: experimentalStrategies,
    },
    { title: 'Data Type:', summary: pickData(data, 'data_type') },
    { title: 'File Format:', summary: pickData(data, 'file_format') },
    { title: 'Size:', summary: pickData(data, 'size', (size) => formatBytesToHumanReadable(size)) },
  ];
};
