import { gql } from '@apollo/client';
import { fields } from './models';

export const STUDIES_QUERY = gql`
  query($sqon: JSON){
    study {
      hits(filters: $sqon) {
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
       aggregations (filters: $sqon){
        ${fields.map(
          (f) =>
            f +
            ' {\n          buckets {\n            key\n            doc_count\n          }\n        }',
        )}
      }
    }
  }
`;

export const STUDIES_BUCKETS = gql`
  {
    study {
      aggregations {
      ${fields.map(
        (f) =>
          f +
          ' {\n          buckets {\n            key\n            doc_count\n          }\n        }',
      )}
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
