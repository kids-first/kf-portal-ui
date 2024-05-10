import { gql } from '@apollo/client';

export const SEARCH_BIOSPECIMEN_QUERY = gql`
  query searchBiospecimen(
    $sqon: JSON
    $first: Int
    $offset: Int
    $sort: [Sort]
    $searchAfter: JSON
  ) {
    biospecimen {
      hits(filters: $sqon, first: $first, offset: $offset, sort: $sort, searchAfter: $searchAfter) {
        total
        edges {
          searchAfter
          node {
            id
            sample_id
            container_id
            diagnoses {
              hits {
                total
                edges {
                  node {
                    mondo_display_term
                    source_text_tumor_descriptor
                    source_text_tumor_location
                    source_text
                    diagnosis_ncit
                  }
                }
              }
            }
            sample_type
            parent_sample_type
            parent_sample_id
            age_at_biospecimen_collection
            collection_ncit_anatomy_site_id
            collection_anatomy_site
            ncit_id_tissue_type
            tissue_type_source_text
            consent_type
            nb_files
            collection_sample_id
            collection_sample_type
            status
            dbgap_consent_code
            collection_method_of_sample_procurement
            volume
            volume_unit
            external_sample_id

            study {
              study_code
              study_name
            }
            participant {
              participant_id
              external_id
            }
            files {
              hits {
                total
                edges {
                  node {
                    sequencing_experiment {
                      hits {
                        edges {
                          node {
                            sequencing_center_id
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

export const GET_PARTICIPANT_BIOSPECIMENS = gql`
  query searchParticipantBiospecimen($sqon: JSON) {
    biospecimen {
      hits(filters: $sqon) {
        total
        edges {
          node {
            id
            sample_id
            sample_type
            parent_sample_type
            parent_sample_id
            age_at_biospecimen_collection
            collection_ncit_anatomy_site_id
            tissue_type_source_text
            collection_anatomy_site
            ncit_id_tissue_type
            tissue_type_source_text
            consent_type
            collection_sample_id
            collection_sample_type
            participant {
              participant_id
            }
            diagnoses {
              hits {
                total
                edges {
                  node {
                    source_text_tumor_descriptor
                    source_text_tumor_location
                  }
                }
              }
            }
            dbgap_consent_code
            volume_unit
            volume
            status
            parent_0 {
              sample_id
            }
          }
        }
      }
    }
  }
`;

export const GET_BIOSPECIMEN_COUNT = gql`
  query getBiospecimenCount($sqon: JSON) {
    biospecimen {
      hits(filters: $sqon) {
        total
      }
    }
  }
`;

export const CHECK_BIOSPECIMEN_MATCH = gql`
  query fetchMatchBiospecimen($sqon: JSON, $first: Int, $offset: Int) {
    biospecimen {
      hits(filters: $sqon, first: $first, offset: $offset) {
        edges {
          node {
            fhir_id
            external_sample_id
            sample_id
            study {
              study_id
              study_code
            }
            container_id
          }
        }
      }
    }
  }
`;

export const BIOSPECIMEN_SEARCH_BY_ID_QUERY = gql`
  query searchBiospecimenById($sqon: JSON) {
    biospecimen {
      hits(filters: $sqon) {
        edges {
          node {
            sample_id
            external_sample_id
            collection_sample_id
          }
        }
      }
    }
  }
`;
