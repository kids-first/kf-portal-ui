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
                    mondo_id_diagnosis
                    source_text
                    ncit_id_diagnosis
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
                    fhir_id
                    hpo_phenotype_observed
                    #                    is_observed
                    age_at_event_days
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
  query getParticpantEntity($sqon: JSON) {
    participant {
      hits(filters: $sqon) {
        edges {
          node {
            participant_id
            sex
            is_proband
            families_id
            ethnicity
            external_id
            study_external_id
            family_type
            race
            study {
              study_code
              study_id
              study_name
            }
            family {
              family_id
              family_relations {
                hits {
                  total
                  edges {
                    node {
                      relation
                      related_participant_id
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
                    mondo_id_diagnosis
                    source_text
                    ncit_id_diagnosis
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
                    fhir_id
                    hpo_phenotype_observed
                    #                    is_observed
                    age_at_event_days
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
            files {
              hits {
                total
                edges {
                  node {
                    data_type
                    sequencing_experiment {
                      hits {
                        edges {
                          node {
                            experiment_strategy
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
            study_id
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
          }
        }
      }
    }
  }
`;
