const AWS = require('aws-sdk'); // eslint-disable-line
const awsConfig = require('../aws.config.json');

// publish to SNS
module.exports.publishSNS = async (customerId, payload) => {
  // keep as a global variable, to avoid
  // reloading for each call to a lambda instance
  if (!global.sns) {
    global.sns = new AWS.SNS();
  }

  const snsPayload = {
    ...payload,
    customerId,
  };

  try {
    await new Promise((resolve, reject) => {
      global.sns.publish(
        {
          Message: JSON.stringify(snsPayload),
          TopicArn: awsConfig.sns.arn,
        },
        (error) => {
          if (error) {
            reject(error);
          } else {
            resolve();
          }
        },
      );
    });
  } catch (error) {
    return Promise.reject(error);
  }

  return null;
};
