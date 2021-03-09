import { gql } from '@apollo/client';

export const STUDIES_QUERY = gql`
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

export const STUDIES_BUCKETS = gql`
  {
    study {
      aggregations {
        domain {
          buckets {
            key
            doc_count
          }
        }
        program {
          buckets {
            key
            doc_count
          }
        }
      }
    }
  }
`;

export const INDEX_EXTENDED_MAPPING = (index: string) => gql`
  {
    ${index} {
      extended
    }
  }
`;