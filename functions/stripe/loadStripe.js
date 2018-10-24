const { getSecret } = require('../aws/getSecret');

<<<<<<< HEAD
module.exports.loadStripe = async () => {
  let stripe = null;

  try {
    const { value } = await getSecret('sls_dynalogic_stripe');
=======
// retreive Stripe API key from AWS Secrets Manager
module.exports.loadStripe = async () => {
  if (!global.stripe) {
    try {
      const { value } = await getSecret('finance-sls-lambda-node-stripe');
>>>>>>> d9dac27... cloned stripe lambda functions from finance project

      if (value && value.sk) {
        // keep as a global variable, to avoid
        // reloading for each call to a lambda instance
        global.stripe = require('stripe')(value.sk); // eslint-disable-line global-require

        console.log('Stripe Loaded\n');
      } else {
        return Promise.reject('Unable to access Stripe\n');
      }
    } catch (errorCatch) {
      return Promise.reject(errorCatch);
    }
<<<<<<< HEAD
  } catch (error) {
    return Promise.reject('Unable to access Stripe SK\n', error, '\n');
=======
>>>>>>> d9dac27... cloned stripe lambda functions from finance project
  }

  return null;
};
