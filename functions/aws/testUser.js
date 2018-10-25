const AWS = require('aws-sdk'); // eslint-disable-line
const awsConfig = require('./aws.config.json');

module.exports.testUser = async (email, customerId) => {
  // keep as a global variable, to avoid
  // reloading when lambda instance is reused
  if (!global.cognito) {
    global.cognito = new AWS.CognitoIdentityServiceProvider(awsConfig.cognito);
  }

  const awsPayload = {
    UserPoolId: awsConfig.cognito.userPoolId,
    Username: email,
  };

  try {
    await new Promise((resolve, reject) => {
      global.cognito.adminGetUser(awsPayload, (errorCallback, response) => {
        if (errorCallback && errorCallback.code === 'UserNotFoundException') {
          resolve();
        } else if (errorCallback) {
          reject(errorCallback);
        } else if (customerId) {
          response.UserAttributes.forEach((attribute) => {
            if (attribute.Name === 'custom:stripe_customer_id') {
              if (attribute.Value === customerId) {
                resolve();
              } else {
                reject({
                  code: 'UsernameExistsException',
                  message: 'This email is already in use',
                });
              }
            }
          });
        } else {
          reject({
            code: 'UsernameExistsException',
            message: 'This email is already in use',
          });
        }
      });
    });
  } catch (error) {
    return Promise.reject(error);
  }

  return null;
};
