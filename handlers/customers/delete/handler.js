const { testAuth } = require('../../../functions/aws/testAuth');
const { loadStripe } = require('../../../functions/stripe/loadStripe');
const { deleteCustomer } = require('../../../functions/stripe/deleteCustomer');
const { errorResponse } = require('../../../functions/errorResponse');

// delete customer
module.exports.delete = async (event, context, callback) => {
  let error = null;
  const { accessToken } = event.query;

  try {
    await testAuth(accessToken);
  } catch (errorCatch) {
    error = errorCatch;
  }

  if (!error) {
    try {
      console.log('loadStripe\n');

      await loadStripe();
    } catch (errorCatch) {
      error = errorCatch;
    }
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
