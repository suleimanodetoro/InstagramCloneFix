import { gql } from "@apollo/client"

//Get latest version of post so update the right version
export const getPost = gql`
  query GetPost($id: ID!) {
    getPost(id: $id) {
      id
      description
      createdAt
      updatedAt
      _version
      _deleted
      _lastChangedAt
      __typename
    }
  }
`;

//request to update post 
export const updatePost = gql`
  mutation UpdatePost(
    $input: UpdatePostInput!
    $condition: ModelPostConditionInput
  ) {
    updatePost(input: $input, condition: $condition) {
      id
      description
      createdAt
      updatedAt
      _version
      _deleted
      _lastChangedAt
      __typename
    }
  }
`;
//Create Post Mutation from API file
export const createPost = gql`
  mutation CreatePost(
    $input: CreatePostInput!
    $condition: ModelPostConditionInput
  ) {
    createPost(input: $input, condition: $condition) {
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
        nOfPosts
        createdAt
        updatedAt
        _version
        _deleted
        _lastChangedAt
        __typename
      }
      Likes {
        items {
          id
          userID
          postID
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
      Comments {
        items {
          id
          comment
          userID
          postID
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
      createdAt
      updatedAt
      _version
      _deleted
      _lastChangedAt
      __typename
    }
  }
`;