import { gql } from '@apollo/client';
import { fields } from './models';

export const STUDIES_QUERY = gql`
  query StudiesInformation ($sqon: JSON){
    Studies {
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
            participant_count
            data_access_authority
            program  
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

export const INDEX_EXTENDED_MAPPING = (index: string) => gql`
  query ExtendedMapping {
    ${index} {
      extended
    }
  }
`;