import { gql } from '@apollo/client';

export const SEARCH_FILES_QUERY = gql`
  query searchFiles($sqon: JSON, $first: Int, $offset: Int, $sort: [Sort], $searchAfter: JSON) {
    file {
      hits(filters: $sqon, first: $first, offset: $offset, sort: $sort, searchAfter: $searchAfter) {
        total
        edges {
          searchAfter
          node {
            id
            external_id
            fhir_id
            file_id
            data_category
            data_type
            file_format
            size
            controlled_access
            access_urls
            acl
            file_name
            repository
            nb_participants
            nb_biospecimens
            imaging_techniques
            imaging_sequence_types
            flywheel_url
            imaging {
              acquisition_number
              device {
                device_id
                magnetic_field_strength
                manufacturer
                model_name
                software_version
              }
              info_body_part_examined
              modality
              scan_id
              session_id
              session_n_total_acquisitions
              subject_reference
            }
            fhir_document_reference
            index {
              urls
              file_name
            }
            participants {
              hits {
                edges {
                  node {
                    participant_id
                    external_id
                    is_proband
                    ethnicity
                    sex
                    race
                    families_id
                    family_type
                    family {
                      relations_to_proband {
                        hits {
                          edges {
                            node {
                              role
                            }
                          }
                        }
                      }
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
                            vital_status
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
                    biospecimens {
                      hits {
                        edges {
                          node {
                            sample_type
                            consent_type
                            external_sample_id
                            collection_sample_type
                            collection_anatomy_site
                            age_at_biospecimen_collection
                            collection_method_of_sample_procurement
                            dbgap_consent_code
                            diagnoses {
                              hits {
                                total
                                edges {
                                  node {
                                    mondo_display_term
                                    source_text_tumor_descriptor
                                    source_text_tumor_location
                                    source_text
                                    ncit_display_term
                                    age_at_event {
                                      value
                                      units
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
            study {
              study_id
              study_name
              study_code
              program
              domain
            }
            sequencing_experiment {
              hits {
                edges {
                  node {
                    experiment_strategy
                    platform
                    instrument_model
                    library_strand
                    is_paired_end
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

export const GET_FILE_ENTITY = gql`
  query getFileEntity($sqon: JSON) {
    file {
      hits(filters: $sqon) {
        edges {
          node {
            id
            acl
            access_urls
            controlled_access
            data_category
            data_type
            file_id
            file_name
            file_format
            is_harmonized
            hashes {
              etag
            }
            nb_biospecimens
            nb_participants
            imaging_techniques
            imaging_sequence_types
            flywheel_url
            imaging {
              acquisition_number
              device {
                device_id
                magnetic_field_strength
                manufacturer
                model_name
                software_version
              }
              info_body_part_examined
              modality
              scan_id
              session_id
              session_n_total_acquisitions
              subject_reference
            }
            participants {
              hits {
                total
                edges {
                  node {
                    biospecimens {
                      hits {
                        edges {
                          node {
                            sample_id
                            sample_type
                            collection_sample_id
                            collection_sample_type
                            dbgap_consent_code
                          }
                        }
                      }
                    }
                    families_id
                    external_id
                    is_proband
                    participant_id
                    study {
                      study_code
                      external_id
                    }
                  }
                }
              }
            }

            sequencing_experiment {
              hits {
                edges {
                  node {
                    sequencing_experiment_id
                    experiment_strategy
                    experiment_date
                    library_name
                    library_strand
                    platform
                    instrument_model
                    external_id
                  }
                }
              }
            }
            size
            study {
              study_name
              study_code
              external_id
            }
          }
        }
      }
    }
  }
`;

export const GET_FILE_COUNT = gql`
  query getFileCount($sqon: JSON) {
    file {
      hits(filters: $sqon) {
        total
      }
    }
  }
`;

export const CHECK_FILE_MATCH = gql`
  query fetchMatchFile($sqon: JSON, $first: Int, $offset: Int) {
    file {
      hits(filters: $sqon, first: $first, offset: $offset) {
        edges {
          node {
            fhir_id
            file_id
            study {
              study_id
              study_code
            }
          }
        }
      }
    }
  }
`;

export const FILE_SEARCH_BY_ID_QUERY = gql`
  query searchFileById($sqon: JSON) {
    file {
      hits(filters: $sqon) {
        edges {
          node {
            file_id
          }
        }
      }
    }
  }
`;
