const { loadStripe } = require('../../../functions/stripe/loadStripe');
const { deleteCustomer } = require('../../../functions/stripe/deleteCustomer');
const { errorResponse } = require('../../../functions/errorResponse');

// delete customer
module.exports.delete = async (event, context, callback) => {
  let error = null;

<<<<<<< HEAD
  if (!stripe) {
    try {
      ({ stripe } = await loadStripe());
    } catch (errorCatch) {
      error = errorCatch;
    }
=======
  try {
    console.log('loadStripe\n');

    await loadStripe();
  } catch (errorCatch) {
    error = errorCatch;
>>>>>>> d9dac27... cloned stripe lambda functions from finance project
  }

  const customerId = event.cognitoPoolClaims.stripe_customer_id;

  if (!error) {
    try {
      console.log('deleteCustomer\n', customerId, '\n');

      await deleteCustomer(customerId);
    } catch (errorCatch) {
      error = errorCatch;
    }
  }

  let errorRes = null;

  if (error) {
    errorRes = errorResponse(error);
  }

  const response = {
    status: 200,
    body: {
      message: 'success',
    },
  };

  callback(errorRes, response);
};
