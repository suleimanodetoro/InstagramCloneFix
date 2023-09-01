/**
 * To make graphql operations easier, apollo client will be added to application:
 * https://www.apollographql.com/docs/react/get-started/
 *
 */

import {
  ApolloClient,
  InMemoryCache,
  ApolloProvider,
  gql,
  ApolloLink,
  createHttpLink,
  TypePolicies,
} from "@apollo/client";

//Import earlier installed packages for using aws appsync with client
import { createAuthLink, AuthOptions, AUTH_TYPE } from "aws-appsync-auth-link";
import {createSubscriptionHandshakeLink} from 'aws-appsync-subscription-link';
import config from "../aws-exports";

interface IClient {
  children: React.ReactNode;
}

const url = config.aws_appsync_graphqlEndpoint;
const region = config.aws_appsync_region;
const auth: AuthOptions = {
    type: config.aws_appsync_authenticationType as AUTH_TYPE.API_KEY ,
    apiKey: config.aws_appsync_apiKey

};

const httpLink = createHttpLink({uri:url})

// In order to group two seperate links (auth link and handshake above) in one, we'll need to use the following =>
const link = ApolloLink.from([
       /**
     * url for 
     * region of api
     * authentication
     */
       createAuthLink({url, region, auth}),
       createSubscriptionHandshakeLink({url, region, auth}, httpLink) //second part needs the type of protocol to communicate
]);
//Merge List to pass two properties: existing: first query payload, and incoming: second query payload
const mergeLists = (existing = {items: []}, incoming = {items: []}) => {
  return {
    ...existing,
    ...incoming,
    // combine incoming and existing.
    items: [...(existing.items || []), ...incoming.items],
  };
};
//Create Object type policies for comment screen cache by @suleimanodetoro
const typePolicies: TypePolicies = {
  // Fetching infinitely when no comments exist
  Query: {
    fields: {
      //Policy for loading more comments
      commentsByPost: {
        //Take all items except the fields responsible for pagination
        keyArgs: ['postID', 'createdAt', 'sortDirection', 'filter'],
        merge: mergeLists,
      },
      //Policy for loading more posts
      postsByDate: {
        keyArgs: ['type', 'createdAt', 'sortDirection', 'filter'],
        merge: mergeLists,
      },
    },
  },
};
const client = new ApolloClient({
  link, //Use link instea dof providing url directly to client
  cache: new InMemoryCache({typePolicies}),
});
const Client = ({ children }: IClient) => {
  return <ApolloProvider client={client}>{children}</ApolloProvider>;
};
export default Client;
