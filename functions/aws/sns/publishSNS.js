const AWS = require('aws-sdk'); // eslint-disable-line
const awsConfig = require('../aws.config.json');

<<<<<<< HEAD
const sns = new AWS.SNS();

module.exports.publishSNS = async (customerId, payload) => {
=======
// publish to SNS
module.exports.publishSNS = async (customerId, payload) => {
  // keep as a global variable, to avoid
  // reloading for each call to a lambda instance
  if (!global.sns) {
    global.sns = new AWS.SNS();
  }

>>>>>>> d9dac27... cloned stripe lambda functions from finance project
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
