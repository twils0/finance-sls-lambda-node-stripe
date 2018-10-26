const { getSecret } = require('../aws/getSecret');

// retreive Stripe API key from Secrets Manager
module.exports.loadStripe = async () => {
  if (!global.stripe) {
    try {
      const { value } = await getSecret('finance-sls-lambda-node-stripe');

      if (value && value.sk) {
        // keep as a global variable, to avoid
        // reloading when lambda instance is reused
        global.stripe = require('stripe')(value.sk); // eslint-disable-line global-require

        console.log('Stripe Loaded\n');
      } else {
        return Promise.reject('Unable to access Stripe\n');
      }
    } catch (errorCatch) {
      return Promise.reject(errorCatch);
    }
  }

  return null;
};
