import { gql } from "@apollo/client";

export const LikesForPostByUser = gql`
  query LikesForPostByUser(
    # because the user field is optional, if it is not given, it will return all likes for a post

    $postID: ID!
    $userID: ModelIDKeyConditionInput
    $sortDirection: ModelSortDirection
    $filter: ModelLikeFilterInput
    $limit: Int
    $nextToken: String
  ) {
    LikesForPostByUser(
      postID: $postID
      userID: $userID
      sortDirection: $sortDirection
      filter: $filter
      limit: $limit
      nextToken: $nextToken
    ) {
      items {
        id
        userID
        postID
        createdAt
        updatedAt
        _version
        _deleted
        _lastChangedAt
        User {
          id
          image
          name
        }
      }
      nextToken
      startedAt
    }
  }
`;