import { gql } from "@apollo/client";


export const createComment = gql`
  mutation CreateComment(
    $input: CreateCommentInput!
    $condition: ModelCommentConditionInput
  ) {
    createComment(input: $input, condition: $condition) {
      id
      comment
      userID
      postID
      Post {
        id
        description
        nOfComments
        createdAt
        updatedAt
        _version
        _deleted
        _lastChangedAt
        __typename
      }
      createdAt
      updatedAt
      _version
      _deleted
      _lastChangedAt
      __typename
    }
  }
`;
export const updateComment = gql`
  mutation UpdateComment(
    $input: UpdateCommentInput!
    $condition: ModelCommentConditionInput
  ) {
    updateComment(input: $input, condition: $condition) {
      id
      comment
      userID
      postID
      User {
        id
        name
        image
        bio
        username
        website
        nOfFollowings
        nOfFollowers
        nOfPosts
        email
        Posts {
          nextToken
          startedAt
          __typename
        }
        Comments {
          nextToken
          startedAt
          __typename
        }
        Likes {
          nextToken
          startedAt
          __typename
        }
        createdAt
        updatedAt
        _version
        _deleted
        _lastChangedAt
        __typename
      }
      Post {
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
          image
          bio
          username
          website
          nOfFollowings
          nOfFollowers
          nOfPosts
          email
          createdAt
          updatedAt
          _version
          _deleted
          _lastChangedAt
          __typename
        }
        Likes {
          nextToken
          startedAt
          __typename
        }
        Comments {
          nextToken
          startedAt
          __typename
        }
        createdAt
        updatedAt
        _version
        _deleted
        _lastChangedAt
        __typename
      }
      createdAt
      updatedAt
      _version
      _deleted
      _lastChangedAt
      __typename
    }
  }
`;
export const deleteComment = gql`
  mutation DeleteComment(
    $input: DeleteCommentInput!
    $condition: ModelCommentConditionInput
  ) {
    deleteComment(input: $input, condition: $condition) {
      id
      comment
      userID
      postID
      User {
        id
        name
        image
        bio
        username
        website
        nOfFollowings
        nOfFollowers
        nOfPosts
        email
        Posts {
          nextToken
          startedAt
          __typename
        }
        Comments {
          nextToken
          startedAt
          __typename
        }
        Likes {
          nextToken
          startedAt
          __typename
        }
        createdAt
        updatedAt
        _version
        _deleted
        _lastChangedAt
        __typename
      }
      Post {
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
          image
          bio
          username
          website
          nOfFollowings
          nOfFollowers
          nOfPosts
          email
          createdAt
          updatedAt
          _version
          _deleted
          _lastChangedAt
          __typename
        }
        Likes {
          nextToken
          startedAt
          __typename
        }
        Comments {
          nextToken
          startedAt
          __typename
        }
        createdAt
        updatedAt
        _version
        _deleted
        _lastChangedAt
        __typename
      }
      createdAt
      updatedAt
      _version
      _deleted
      _lastChangedAt
      __typename
    }
  }
`; 

export const commentsByPost = gql`
  query CommentsByPost(
    $postID: ID!
    $sortDirection: ModelSortDirection
    $filter: ModelCommentFilterInput
    $limit: Int
    $nextToken: String
  ) {
    # From here is what you'll use to edit apollo client file for fetchMore request
    commentsByPost(
      postID: $postID
      sortDirection: $sortDirection
      filter: $filter
      limit: $limit
      nextToken: $nextToken
    ) {
      items {
        id
        comment
        userID
        postID
        User {
          id
          name
          image
          username
          createdAt
          updatedAt
          _version
          _deleted
          _lastChangedAt
          __typename
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

//subscription for real time data in comments screen
//The fields we are querying back should be a subset of the fields we get when running a mutation (See commentservice onCreateComment)
export const onCreateComment = gql`
  subscription OnCreateComment($filter: ModelSubscriptionCommentFilterInput) {
    onCreateComment(filter: $filter) {
      id
      comment
      userID
      postID
      Post {
        id
        description
        nOfComments
        createdAt
        updatedAt
        _version
        _deleted
        _lastChangedAt
        __typename
      }
      # After copying from identical query from comment service, add user details because its needed to render a comment
      # This means you need to add it the comment service file too. They need to be identical...
      User {
        id
        image
        username
        name

      }
      createdAt
      updatedAt
      _version
      _deleted
      _lastChangedAt
      __typename
    }
  }
`;