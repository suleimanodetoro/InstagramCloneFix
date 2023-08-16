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
const env = process.env.API_INSTAGRAM_GRAPHQLAPIIDOUTPUT; //auto received from the lambda function-- you can check @ code source in aws lambda i think...
const AppSyncID = "";

//This 'aws-sdk' will be automatically present in any environment that runs lambda functioins so you do not need to install it
const AWS = require("aws-sdk");

//Get the table name to use in data storage for dynamo
const TableName = `User-${AppSyncID}-${env}`;

// The following varibale will be used to make interating with DynamoDB less stessful
const docClient = new AWS.DynamoDB.DocumentClient();

//Function to check if user already exists
const userExists = async (id) => {
  //Param to pass to docClient. Please refer to aws Dynamo Document Client documentation
  const params = {
    TableName: TableName,
    key: id,
  };
  try {
    const response = await docClient.get(params).promise();
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
    _lastChangedAt: timestamp,
    _version: 1,
    updatedAt: dateString,
  };
  const params = {
    TableName: TableName,
    Item,
  };
  try {
    await docClient.put(params).promise();
  } catch (error) {
    console.log(error);
  }
}; // end of save user function

// This code will be called everytime your user is confirmed:
exports.handler = async (event, context) => {
  console.log("Lambda function function working haha");
  console.log(event);

  //Check if user data is availble in database with AWS lambda, and store the details
  const userAttributes = event?.request?.userAttributes;
  if (!userAttributes) {
    console.log("No user data available");
    return;
  }
  /**
   * Check if user already exists
   * Now, the userAttribute contain "sub" which is a unique identifier for every user created in cognito user pool
   * Store this data to the database as id for a user
   */
  const newUser = {
    id: userAttributes.sub,
    name: userAttributes.name,
    email: userAttributes.email,
  };
  //If not already saved, save user to dynamo database
  if (await userExists(newUser.id)) {
    await saveUser(newUser);
    console.log(`${newUser.id} has been saved to database`);
  } else {
    console.log(`${newUser.id} already exist`);
  }

  return event;
};
