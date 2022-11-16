import { gql } from '@apollo/client';

export const SEARCH_MEMBERS_QUERY = gql`
  query members($sqon: JSON, $first: Int, $offset: Int, $sort: [Sort]) {
    members {
      hits(filters: $sqon, first: $first, offset: $offset, sort: $sort) {
        total
        edges {
          node {
            id
            lastName
            searchableInterests {
              hits {
                edges {
                  node {
                    name
                  }
                }
              }
            }
            roles
            isActive
            title
            institution
            isPublic
            email
            firstName
            interests
            linkedin
            website
          }
        }
      }
    }
  }
`;

export const SEARCH_MEMBER_BY_ID_QUERY = gql`
  query searchMemberById($sqon: JSON) {
    members {
      hits(filters: $sqon) {
        edges {
          node {
            id
          }
        }
      }
    }
  }
`;

export const GET_MEMBERS_COUNT = gql`
  query getMemebersCount($sqon: JSON) {
    members {
      hits(filters: $sqon) {
        total
      }
    }
  }
`;
