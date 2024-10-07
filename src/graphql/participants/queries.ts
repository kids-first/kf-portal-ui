import { gql } from '@apollo/client';

export const SEARCH_PARTICIPANT_QUERY = gql`
  query searchParticipant(
    $sqon: JSON
    $first: Int
    $offset: Int
    $sort: [Sort]
    $searchAfter: JSON
  ) {
    participant {
      hits(filters: $sqon, first: $first, offset: $offset, sort: $sort, searchAfter: $searchAfter) {
        total
        edges {
          searchAfter
          node {
            participant_id
            sex
            is_proband
            families_id
            ethnicity
            nb_files
            nb_biospecimens
            external_id
            study_external_id
            family_type
            race
            files {
              hits {
                total
                edges {
                  node {
                    data_type
                  }
                }
              }
            }
            study {
              study_code
              study_id
              study_name
            }
            diagnosis {
              hits {
                total
                edges {
                  node {
                    mondo_display_term
                    source_text
                    ncit_display_term
                    age_at_event_days
                  }
                }
              }
            }
            outcomes {
              hits {
                total
                edges {
                  node {
                    fhir_id
                    release_id
                    study_id
                    participant_fhir_id
                    vital_status
                    observation_id
                    age_at_event_days {
                      value
                      units
                    }
                  }
                }
              }
            }
            phenotype {
              hits {
                total
                edges {
                  node {
                    age_at_event_days
                    fhir_id
                    hpo_phenotype_observed
                    hpo_phenotype_observed_text
                    hpo_phenotype_not_observed
                    hpo_phenotype_not_observed_text
                    is_observed
                    source_text
                  }
                }
              }
            }
            observed_phenotype {
              hits {
                total
                edges {
                  node {
                    is_leaf
                    is_tagged
                    name
                    parents
                    age_at_event_days
                  }
                }
              }
            }
          }
        }
      }
    }
  }
`;

export const GET_PARTICIPANT_ENTITY = gql`
  query getParticipantEntity($sqon: JSON) {
    participant {
      hits(filters: $sqon) {
        edges {
          node {
            id
            diagnosis {
              hits {
                edges {
                  node {
                    mondo_display_term
                    source_text
                    age_at_event_days
                    diagnosis_id
                    ncit_display_term
                  }
                }
              }
            }
            down_syndrome_status
            ethnicity
            external_id
            family {
              family_id
              relations_to_proband {
                hits {
                  edges {
                    node {
                      role
                      participant_id
                    }
                  }
                }
              }
            }
            family_type
            files {
              hits {
                total
                edges {
                  node {
                    data_type
                    data_category
                    sequencing_experiment {
                      hits {
                        edges {
                          node {
                            experiment_strategy
                          }
                        }
                      }
                    }
                    biospecimens {
                      hits {
                        total
                        edges {
                          node {
                            age_at_biospecimen_collection
                            biospecimen_storage
                            collection_anatomy_site
                            collection_method_of_sample_procurement
                            collection_ncit_anatomy_site
                            diagnoses {
                              hits {
                                total
                                edges {
                                  node {
                                    mondo_display_term
                                    source_text
                                    source_text_tumor_location
                                    source_text_tumor_descriptor
                                    ncit_display_term
                                  }
                                }
                              }
                            }
                            ncit_id_tissue_type
                            collection_sample_id
                            collection_sample_type
                            consent_type
                            container_id
                            dbgap_consent_code
                            fhir_id
                            laboratory_procedure
                            parent_sample_id
                            parent_sample_type
                            sample_id
                            sample_type
                            status
                            tissue_type_source_text
                            volume
                            volume_unit
                            tumor_status
                            has_matched_normal_sample
                            preservation_method
                            sdg_id
                          }
                        }
                      }
                    }
                  }
                }
              }
            }
            is_proband
            nb_biospecimens
            nb_files
            outcomes {
              hits {
                total
                edges {
                  node {
                    vital_status
                    age_at_event_days {
                      value
                      units
                    }
                  }
                }
              }
            }
            participant_id
            phenotype {
              hits {
                edges {
                  node {
                    age_at_event_days
                    fhir_id
                    hpo_phenotype_observed
                    hpo_phenotype_observed_text
                    hpo_phenotype_not_observed
                    hpo_phenotype_not_observed_text
                    is_observed
                    source_text
                  }
                }
              }
            }
            race
            study {
              study_name
              external_id
              study_code
            }
            study_id
            sex
          }
        }
      }
    }
  }
`;

export const MATCH_PARTICIPANT_QUERY = gql`
  query fetchMatchParticipant($sqon: JSON) {
    participant {
      hits(filters: $sqon) {
        edges {
          node {
            participant_id: id
            study {
              hits {
                total
                edges {
                  node {
                    study_id
                  }
                }
              }
            }
          }
        }
        total
      }
    }
  }
`;

export const GET_PARTICIPANT_COUNT = gql`
  query getParticipantCount($sqon: JSON) {
    participant {
      hits(filters: $sqon) {
        total
      }
    }
  }
`;

export const CHECK_PARTICIPANT_MATCH = gql`
  query fetchMatchParticipant($sqon: JSON, $first: Int, $offset: Int) {
    participant {
      hits(filters: $sqon, first: $first, offset: $offset) {
        edges {
          node {
            fhir_id
            participant_id
            external_id
            families_id
            study {
              study_code
            }
          }
        }
      }
    }
  }
`;
export const PARTICIPANT_SEARCH_BY_ID_QUERY = gql`
  query searchParticipantById($sqon: JSON) {
    participant {
      hits(filters: $sqon) {
        edges {
          node {
            participant_id
            external_id
            families_id
          }
        }
      }
    }
  }
`;

export const GET_DATA_FILE_AGG = gql`
  query getDataFileAgg($sqon: JSON) {
    file {
      aggregations(filters: $sqon, include_missing: false) {
        exp_strategies: sequencing_experiment__experiment_strategy {
          buckets {
            key
          }
        }
        data_category {
          buckets {
            key
          }
        }
      }
    }
  }
`;
