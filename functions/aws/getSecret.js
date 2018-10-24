const AWS = require('aws-sdk'); // eslint-disable-line
const awsConfig = require('./aws.config.json');

<<<<<<< HEAD
const secretsManager = new AWS.SecretsManager(awsConfig.secretsManager);

module.exports.getSecret = async (key) => {
=======
// retreive a secret from AWS Secrets Manager
module.exports.getSecret = async (key) => {
  // keep as a global variable, to avoid
  // reloading for each call to a lambda instance
  if (!global.secretsManager) {
    global.secretsManager = new AWS.SecretsManager(awsConfig.secretsManager);
  }

>>>>>>> d9dac27... cloned stripe lambda functions from finance project
  let value = null;

  try {
    value = await new Promise((resolve, reject) => {
<<<<<<< HEAD
      secretsManager.getSecretValue({ SecretId: key }, (error, data) => {
        if (error) {
          reject(error);
=======
      global.secretsManager.getSecretValue({ SecretId: key }, (errorCallback, data) => {
        if (errorCallback) {
          reject(errorCallback);
        } else if (data && data.SecretString) {
          resolve(JSON.parse(data.SecretString));
>>>>>>> d9dac27... cloned stripe lambda functions from finance project
        } else {
          resolve(JSON.parse(data.SecretString));
        }
      });
    });
  } catch (error) {
    return Promise.reject(error);
  }

  return { value };
};
