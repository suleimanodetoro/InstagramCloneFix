/**
 * @type {import('@types/aws-lambda').APIGatewayProxyHandler}
 */

//NOTE: IF THERE ARE ANY PROBLEMS, VIEW LOGS IN CLOUDWATCH, OTHER APPS

/**
 *Before proceeding, to run the following code: saving and checking users,  
 *allow lamda to communicate with appsync had to be configured
 *As for the api permissions, this was done by running-> amplify update function > resource access > api > query and mutations > No
 *To do same for Dynamo DB, you will need to play around with changing resource policy with cloudformation haha.
 *This template is basically the definition of lamda function. The source code on one side, and then the architecture (cloudformation) on the pother side. Roles, env variables,
 *Navigate to amplify > backend > function > appName > src > appNameCloudFormation . Search "Resources", and put the "LambdaDynamoDbPolicy" code choice in.
 *After everything run amplify push.
 *Before proceeding, to run the following code: saving and checking users,  allow lamda to communicate with appsync had to be configured
 *As for the api permissions, this was done by running-> amplify update function > resource access > api > query and mutations > No

 *To do same for Dynamo DB, you will need to play around with changing resource policy with cloudformation haha.
 *This template is basically the definition of lamda function. The source code on one side, and then the architecture (cloudformation) on the pother side. Roles, env variables,
 *Navigate to amplify > backend > function > appName > src > appNameCloudFormation . Search "Resources", and put the "LambdaDynamoDbPolicy" code choice in.
 *After everything run amplify push.

 */

//Get the env name and AppSync ID to construct the table name
const env = process.env.ENV; //auto received from the lambda function-- you can check @ code source in aws lambda i think...
const AppSyncID = process.env.API_INSTAGRAM_GRAPHQLAPIIDOUTPUT;

//This 'aws-sdk' will be automatically present in any environment that runs lambda functioins so you do not need to install it
const { DynamoDBDocument } = require("@aws-sdk/lib-dynamodb"),
  { DynamoDB } = require("@aws-sdk/client-dynamodb");

//Get the table name to use in data storage for dynamo
const TableName = `User-${AppSyncID}-${env}`;

// The following varibale will be used to make interating with DynamoDB less stessful
const docClient = DynamoDBDocument.from(new DynamoDB());

//Function to check if user already exists
const userExists = async (id) => {
  //Param to pass to docClient. Please refer to aws Dynamo Document Client documentation
  const params = {
    TableName: TableName,
    Key: id,
  };
  try {
    const response = await docClient.get(params);
    return !!response?.Item;
  } catch (error) {
    console.log(error);
    return false;
  }
};

//Function to Save user to dynamo  database
const saveUser = async (user) => {
  //get current date to pass to "Item" fields
  const date = new Date();
  const dateString = date.toISOString();
  const timestamp = date.getTime();

  /**Create item to use in param, to pass to docClient. Please refer to aws Dynamo Document Client documentation
   *Fields as viewed in dynamo db item explore tab.
   *Store fields that need to be stored in the table but won't be created by normal app interaction eg __typename
   */
  const Item = {
    ...user,
    __typename: "User",
    createdAt: dateString,
    updatedAt: dateString,
    _lastChangedAt: timestamp,
    _version: 1,
  };
  const params = {
    TableName: TableName,
    Item,
  };
  try {
    await docClient.put(params);
    console.log("User saved successfully");
  } catch (error) {
    console.log("Error saving user:", error);
  }
}; // end of save user function

// This code will be called everytime your user is confirmed:
exports.handler = async (event, context) => {
  console.log(
    `${TableName}-tablename... Lambda function function working haha`
  );
  console.log(event);

  //Check if user data is availble in database with AWS lambda, and store the details
  if (!event?.request?.userAttributes) {
    console.log("No user data available");
    return;
  }
  /**
   * Ater checking user exists, the userAttribute contain "sub" which is a unique identifier for every user created in cognito user pool
   * Store this data to the database as id for a user
   */
  const { sub, name, email } = event.request.userAttributes;
  const newUser = {
    id: sub,
    name: name,
    email: email,
  };
  //If not already saved, save user to dynamo database
  if (!(await userExists(newUser.id))) {
    await saveUser(newUser);
    console.log(`${newUser.id} has been saved to database`);
  } else {
    console.log(`${newUser.id} already exist`);
  }

  return event;
};
