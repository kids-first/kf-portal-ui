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
            fhir_document_reference
            index {
              urls
              file_name
            }
            study {
              study_id
              study_name
              study_code
            }
            sequencing_experiment {
              hits {
                edges {
                  node {
                    experiment_strategy
                    platform
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
                          }
                        }
                      }
                    }
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
