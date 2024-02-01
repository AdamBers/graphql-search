import { gql } from "@apollo/client";

export interface ISearchRepositoriesVariables {
  query: string;
  type: string;
  first: number;
  after?: string | null;
}

export const SEARCH_REPOSITORIES = gql`
  query SearchRepositories(
    $query: String!
    $type: SearchType = REPOSITORY
    $first: Int = 10
    $after: String
  ) {
    search(query: $query, type: $type, first: $first, after: $after) {
      edges {
        node {
          ... on Repository {
            name
            id
          }
        }
      }
      pageInfo {
        startCursor
        endCursor
        hasNextPage
        hasPreviousPage
      }
    }
  }
`;
