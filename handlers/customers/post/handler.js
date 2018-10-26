const { loadStripe } = require('../../../functions/stripe/loadStripe');
const { testUser } = require('../../../functions/aws/testUser');
const { testCoupon } = require('../../../functions/stripe/testCoupon');
const { addCustomer } = require('../../../functions/stripe/addCustomer');
const { addSubscription } = require('../../../functions/stripe/addSubscription');
const { publishSNS } = require('../../../functions/aws/sns/publishSNS');
const { errorResponse } = require('../../../functions/errorResponse');


// verified that the new user's email does not already exist
// in Cognito; create a new Stripe customer and add a subscription,
// billing every quarter and prorating for the first quarter;
// if provided, verify promo code and add to the subscription plan;
// publish an SNS message, which is picked up by another lambda
// function to add user to Cogntio and PostgreSQL database
module.exports.post = async (event, context, callback) => {
  let error = null;

  try {
    console.log('loadStripe\n');

    await loadStripe();
  } catch (errorCatch) {
    error = errorCatch;
  }

  const { body } = event;

  if (!error && !Object.prototype.hasOwnProperty.call(body, 'token')) {
    error = {
      code: 'invalid_body',
      message: "Please provide a 'token' key in the body of your request.",
    };
  }
  if (!error && !Object.prototype.hasOwnProperty.call(body, 'plan')) {
    error = {
      code: 'invalid_body',
      message: "Please provide a 'plan' key in the body of your request.",
    };
  }
  if (!error && !Object.prototype.hasOwnProperty.call(body, 'email')) {
    error = {
      code: 'invalid_body',
      message: "Please provide an 'email' key in the body of your request.",
    };
  }
  if (!error && !Object.prototype.hasOwnProperty.call(body, 'password')) {
    error = {
      code: 'invalid_body',
      message: "Please provide an 'password' key in the body of your request.",
    };
  }
  if (!error && !Object.prototype.hasOwnProperty.call(body, 'phone')) {
    error = {
      code: 'invalid_body',
      message: "Please provide an 'phone' key in the body of your request.",
    };
  }
  if (!error && !Object.prototype.hasOwnProperty.call(body, 'name')) {
    error = {
      code: 'invalid_body',
      message: "Please provide an 'name' key in the body of your request.",
    };
  }

  let customerId = null;
  const bodyNoPassword = { ...body };
  delete bodyNoPassword.password;

  if (!error) {
    try {
      console.log('testUser\n', bodyNoPassword.email, '\n');

      await testUser(body.email);
    } catch (errorCatch) {
      error = errorCatch;
    }
  }

  if (!error && body.promoCode) {
    try {
      console.log('testCoupon\n', bodyNoPassword.promoCode, '\n');

      await testCoupon(bodyNoPassword.promoCode);
    } catch (errorCatch) {
      error = errorCatch;
    }
  }

  if (!error) {
    try {
      console.log('addCustomer\n', bodyNoPassword);

      ({ customerId } = await addCustomer(bodyNoPassword));

      console.log('addCustomer - success\n', customerId);
    } catch (errorCatch) {
      error = errorCatch;
    }
  }

  if (!error) {
    try {
      console.log('addSubscription\n', customerId, '\n', bodyNoPassword, '\n');

      await addSubscription(customerId, bodyNoPassword);
    } catch (errorCatch) {
      error = errorCatch;
    }
  }

  // publish to SNS; sls_lambda_db listens for SNS and adds user
  // to Cognito and PostgreSQL database; it's important to
  // ensure Stripe is processed first; the customer should not
  // pay and then rea
  if (!error) {
    try {
      console.log('publishSNS\n', customerId, '\n', bodyNoPassword, '\n');

      await publishSNS(customerId, body);
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
