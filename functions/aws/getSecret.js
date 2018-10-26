const AWS = require('aws-sdk'); // eslint-disable-line
const awsConfig = require('./aws.config.json');

// retreive a secret from Secrets Manager
module.exports.getSecret = async (key) => {
  // keep as a global variable, to avoid
  // reloading for each call to a lambda instance
  if (!global.secretsManager) {
    global.secretsManager = new AWS.SecretsManager(awsConfig.secretsManager);
  }

  let value = null;

  try {
    value = await new Promise((resolve, reject) => {
      global.secretsManager.getSecretValue({ SecretId: key }, (errorCallback, data) => {
        if (errorCallback) {
          reject(errorCallback);
        } else if (data && data.SecretString) {
          resolve(JSON.parse(data.SecretString));
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
