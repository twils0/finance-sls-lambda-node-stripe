const AWS = require('aws-sdk'); // eslint-disable-line
const awsConfig = require('./aws.config.json');

const cognito = new AWS.CognitoIdentityServiceProvider(awsConfig.cognito);

module.exports.updateUserAttributes = async (payload, customerId) => {
  const awsPayload = {
    Username: payload.email,
    UserPoolId: awsConfig.cognito.userPoolId,
  };

  awsPayload.UserAttributes = [
    {
      Name: 'custom:stripe_customer_id',
      Value: customerId,
    },
  ];

  try {
    await new Promise((resolve, reject) => {
      cognito.adminUpdateUserAttributes(awsPayload, (error, response) => {
        if (error) {
          reject(error);
        } else {
          resolve(response);
        }
      });
    });
  } catch (error) {
    return Promise.reject(error);
  }

  return null;
};
