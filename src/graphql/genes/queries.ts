import { gql } from '@apollo/client';

export const CHECK_GENE_MATCH_QUERY = gql`
  query CheckGenesMatch($sqon: JSON, $first: Int, $offset: Int) {
    Genes {
      hits(filters: $sqon, first: $first, offset: $offset) {
        edges {
          node {
            symbol
            omim_gene_id
            alias
            ensembl_gene_id
          }
        }
      }
    }
  }
`;
