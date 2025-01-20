import { gql } from '@apollo/client';

export const SEARCH_STUDIES_QUERY = gql`
  query searchStudy($sqon: JSON, $first: Int, $offset: Int, $sort: [Sort]) {
    study {
      hits(filters: $sqon, first: $first, offset: $offset, sort: $sort) {
        total
        edges {
          node {
            id
            domain
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

export const SEARCH_STUDIES_BY_ID_AND_NAME_QUERY = gql`
  query searchStudyById($sqon: JSON) {
    study {
      hits(filters: $sqon) {
        edges {
          node {
            study_id
            study_code
            study_name
            external_id
          }
        }
      }
    }
  }
`;

export const GET_STUDY_COUNT = gql`
  query getStudiesCount($sqon: JSON) {
    study {
      hits(filters: $sqon) {
        total
      }
    }
  }
`;

export const GET_STUDIES_ENTITY = gql`
  query searchStudyByCode($sqon: JSON) {
    study {
      hits(filters: $sqon) {
        edges {
          node {
            study_code
            study_name
          }
        }
      }
    }
  }
`;
