const { getDefaultConfig } = require("expo/metro-config");
const exclusionList = require("metro-config/src/defaults/exclusionList");

const config = getDefaultConfig(__dirname);
/**
 * In case of aws launch client
 * https://github.com/apollographql/apollo-client/blob/main/CHANGELOG.md#apollo-client-354-2021-11-19
 * 
 * In case that link fix does not work, use this:
 * const exclusionList = require('metro- config/src/defaults/exclusionList');

and then :
module.exports = {
resolver: {
blacklistRE: exclusionList([/#current-cloud-backend\/.'*'/]),
**Remember to remove the ' from the end of previous line for code to work
},
 */
config.resolver.blacklistRE = exclusionList([
  /amplify\/#current-cloud-backend\/.*/,
]);

module.exports = config;
