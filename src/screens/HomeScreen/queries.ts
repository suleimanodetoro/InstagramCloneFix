import { gql } from "@apollo/client";
export const listPosts = gql`
  query ListPosts(
    $filter: ModelPostFilterInput
    $limit: Int
    $nextToken: String
  ) {
    listPosts(filter: $filter, limit: $limit, nextToken: $nextToken) {
      items {
        id
        description
        image
        video
        images
        nOfComments
        nOfLikes
        userID
        User {
          id
          name
          username
          image
        }
        Comments {
          items {
            id
            comment
            User {
              id
              name
              username
            }
          }
        }
        createdAt
        updatedAt
        _version
        _deleted
        _lastChangedAt
        __typename
      }
      nextToken
      startedAt
      __typename
    }
  }
`;