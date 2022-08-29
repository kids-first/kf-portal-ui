import { gql } from '@apollo/client';

export const FETCH_STUDIES_QUERY = gql`
  query getStudy {
    study: Study {
      hits {
        total
        edges {
          node {
            id
            study_id
            study_code
            study_name
            program
            external_id
            participant_count
            family_count
            biospecimen_count
            attribution
            data_category
            website
          }
        }
      }
    }
  }
`;

export const SEARCH_STUDIES_QUERY = gql`
  query searchStudy($sqon: JSON, $first: Int, $offset: Int, $sort: [Sort]) {
    study: Study {
      hits(filters: $sqon, first: $first, offset: $offset, sort: $sort) {
        total
        edges {
          node {
            id
            study_id
            study_code
            study_name
            program
            external_id
            participant_count
            family_count
            biospecimen_count
            attribution
            data_category
            website
          }
        }
      }
    }
  }
`;
