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
const client = new ApolloClient({
  link, //Use link instea dof providing url directly to client
  cache: new InMemoryCache(),
});
const Client = ({ children }: IClient) => {
  return <ApolloProvider client={client}>{children}</ApolloProvider>;
};
export default Client;
