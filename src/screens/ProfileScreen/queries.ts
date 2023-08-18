import {gql} from "@apollo/client"
export const getUser = gql `
  query GetUser($id: ID!) {
    getUser(id: $id) {
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
        items {
            id
            image
            images
            video
        }
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