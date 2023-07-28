/**
 * @type {import('@types/aws-lambda').APIGatewayProxyHandler}
 */
// This code will be called everytime your user is confirmed:
exports.handler = async (event, context) => {
  console.log('Lambda function function working haha');
  console.log(event);
  // insert code to be executed by your lambda trigger
  return event;
};
