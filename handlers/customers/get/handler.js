const { testAuth } = require('../../../functions/aws/testAuth');
const { loadStripe } = require('../../../functions/stripe/loadStripe');
const { getCustomer } = require('../../../functions/stripe/getCustomer');
const { errorResponse } = require('../../../functions/errorResponse');

// get customer nameOnCard, promoCode, and promoCodeValid
module.exports.get = async (event, context, callback) => {
  let error = null;
  const { accessToken } = event.query;

  try {
<<<<<<< HEAD
    await testAuth(accessToken);
=======
    await loadStripe();
>>>>>>> d9dac27... cloned stripe lambda functions from finance project
  } catch (errorCatch) {
    error = errorCatch;
  }

  if (!stripe) {
    try {
      ({ stripe } = await loadStripe());
    } catch (errorCatch) {
      error = errorCatch;
    }
  }

  const customerId = event.cognitoPoolClaims.stripe_customer_id;
  let nameOnCard = null;
  let couponId = null;
  let couponValid = null;

  if (!error) {
    try {
      console.log('getCustomer\n', customerId, '\n');

      ({ nameOnCard, couponId, couponValid } = await getCustomer(customerId));

      console.log('getCustomer - success\n', nameOnCard, '\n', couponId, '\n', couponValid, '\n');
    } catch (errorCatch) {
      error = errorCatch;
      console.log(error);
    }
  }

  let errorRes = null;

  if (error) {
    errorRes = errorResponse(error);
  }

  const response = {
    status: 200,
    body: {
      nameOnCard,
      promoCode: couponId,
      promoCodeValid: couponValid,
    },
  };

  callback(errorRes, response);
};
