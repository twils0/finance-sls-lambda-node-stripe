const AWS = require('aws-sdk'); // eslint-disable-line
const awsConfig = require('./aws.config.json');

<<<<<<< HEAD
const cognito = new AWS.CognitoIdentityServiceProvider(awsConfig.cognito);

module.exports.testAuth = async (accessToken) => {
=======
// ensure that the accessToken provided is still valid
module.exports.testAuth = async (accessToken) => {
  // keep as a global variable, to avoid
  // reloading for each call to a lambda instance
  if (!global.cognito) {
    global.cognito = new AWS.CognitoIdentityServiceProvider(awsConfig.cognito);
  }

>>>>>>> d9dac27... cloned stripe lambda functions from finance project
  const awsPayload = {
    AccessToken: accessToken,
  };

  try {
    await new Promise((resolve, reject) => {
<<<<<<< HEAD
      cognito.getUser(awsPayload, (error, response) => {
        if (error) {
          console.log('testAuth - failed, unauthorized user');

          reject(error);
=======
      global.cognito.getUser(awsPayload, (errorCallback, response) => {
        if (errorCallback) {
          reject(errorCallback);
>>>>>>> d9dac27... cloned stripe lambda functions from finance project
        } else {
          console.log('testAuth - success');

          resolve(response);
        }
      });
    });
  } catch (error) {
    return Promise.reject(error);
  }

  return null;
};
