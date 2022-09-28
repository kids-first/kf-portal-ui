import { gql } from '@apollo/client';

export const SEARCH_PARTICIPANT_QUERY = gql`
  query searchParticipant($sqon: JSON, $first: Int, $offset: Int, $sort: [Sort]) {
    participant {
      hits(filters: $sqon, first: $first, offset: $offset, sort: $sort) {
        total
        edges {
          node {
            kf_id
            score
            age_at_recruitment
            age_of_death
            cause_of_death
            date_of_recruitment
            dictionary_version
            dob
            environment_exposure_available
            ethnicity
            family_history_available
            gender
            genealogy_available
            is_a_proband
            is_affected
            laboratory_measures_available
            lifestyle_available
            medication_available
            physical_measures_available
            study_version
            study_version_creation_date
            vital_status

            files {
              hits {
                total
              }
            }
            studies: study {
              hits {
                total
                edges {
                  node {
                    kf_id
                    name
                  }
                }
              }
            }
            diagnoses {
              hits {
                total
                edges {
                  node {
                    internal_diagnosis_id
                    score
                    age_at_diagnosis
                    diagnosis_ICD_code
                    diagnosis_mondo_code
                    diagnosis_source_text
                    diagnosis_type
                    is_cancer
                    is_cancer_primary
                    is_self_reported
                    m_category
                    submitter_participant_id: submitter_donor_id
                    submitter_diagnosis_id
                  }
                }
              }
            }
            phenotype: observed_phenotypes {
              age_at_event
              display_name
              internal_phenotype_id
              is_leaf
              is_tagged
              name
              parents
              phenotype_id
            }
            phenotypes_tagged: observed_phenotype_tagged {
              hits {
                total
                edges {
                  node {
                    display_name
                    #age_at_event
                    internal_phenotype_id
                    is_leaf
                    is_tagged
                    name
                    parents
                    phenotype_id
                    main_category
                    score
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
                    kf_id
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
            kf_id
          }
        }
      }
    }
  }
`;
