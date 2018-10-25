const AWS = require('aws-sdk'); // eslint-disable-line
const awsConfig = require('./aws.config.json');

// ensure that the accessToken provided is still valid
module.exports.testAuth = async (accessToken) => {
  // keep as a global variable, to avoid
  // reloading when lambda instance is reused
  if (!global.cognito) {
    global.cognito = new AWS.CognitoIdentityServiceProvider(awsConfig.cognito);
  }

  const awsPayload = {
    AccessToken: accessToken,
  };

  try {
    await new Promise((resolve, reject) => {
      global.cognito.getUser(awsPayload, (errorCallback, response) => {
        if (errorCallback) {
          reject(errorCallback);
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
