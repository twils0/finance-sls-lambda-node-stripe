const AWS = require('aws-sdk'); // eslint-disable-line
const awsConfig = require('./aws.config.json');

<<<<<<< HEAD
const cognito = new AWS.CognitoIdentityServiceProvider(awsConfig.cognito);
=======
module.exports.testUser = async (email, userId) => {
  // keep as a global variable, to avoid
  // reloading for each call to lambda instance
  if (!global.cognito) {
    global.cognito = new AWS.CognitoIdentityServiceProvider(awsConfig.cognito);
  }
>>>>>>> d9dac27... cloned stripe lambda functions from finance project

module.exports.testUser = async (email, customerId) => {
  const awsPayload = {
    UserPoolId: awsConfig.cognito.userPoolId,
    Username: email,
  };

  try {
    await new Promise((resolve, reject) => {
<<<<<<< HEAD
      cognito.adminGetUser(awsPayload, (error, response) => {
        if (error && error.code === 'UserNotFoundException') {
=======
      global.cognito.adminGetUser(awsPayload, (errorCallback, response) => {
        if (errorCallback && errorCallback.code === 'UserNotFoundException') {
>>>>>>> d9dac27... cloned stripe lambda functions from finance project
          resolve();
        } else if (error) {
          reject(error);
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
