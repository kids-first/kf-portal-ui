import { gql } from "@apollo/client";

export const FETCH_STUDIES_QUERY = gql`
  query getStudy {
    study {
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
