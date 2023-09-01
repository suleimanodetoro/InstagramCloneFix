import { gql } from "@apollo/client";

export const postsByDate = gql `
  query PostsByDate(
    $type: String!
    $createdAt: ModelStringKeyConditionInput
    $sortDirection: ModelSortDirection
    $filter: ModelPostFilterInput
    $limit: Int
    $nextToken: String
  ) {
    postsByDate(
      type: $type
      createdAt: $createdAt
      sortDirection: $sortDirection
      filter: $filter
      limit: $limit
      nextToken: $nextToken
    ) {
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
        # Limit the comments displayed in feed post to two
        Comments(filter: { _deleted: { ne: true } }) {
          items {
            id
            comment
            _deleted
            User {
              id
              name
              username
            }
          }
          nextToken
          startedAt
        }
        Likes {
          items {
            id
            _deleted
            User {
              id
              username
            }
          }
          nextToken
          startedAt
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