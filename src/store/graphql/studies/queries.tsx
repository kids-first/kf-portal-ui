import { gql } from '@apollo/client';

export const STUDIES_PAGE_DATA = gql`
  {
    study {
      hits {
        edges {
          node {
            kf_id
            name
            domain
            score
            code
            family_count
            file_count
          }
        }
      }
    }
  }
`;
