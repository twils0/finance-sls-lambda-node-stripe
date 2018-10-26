const { testAuth } = require('../../../functions/aws/testAuth');
const { loadStripe } = require('../../../functions/stripe/loadStripe');
const { testUser } = require('../../../functions/aws/testUser');
const { getCustomer } = require('../../../functions/stripe/getCustomer');
const { updateCustomer } = require('../../../functions/stripe/updateCustomer');
const { testCoupon } = require('../../../functions/stripe/testCoupon');
const { updateSubscription } = require('../../../functions/stripe/updateSubscription');
const { deleteDiscount } = require('../../../functions/stripe/deleteDiscount');
const { deleteSubscription } = require('../../../functions/stripe/deleteSubscription');
const { addSubscription } = require('../../../functions/stripe/addSubscription');
const { errorResponse } = require('../../../functions/errorResponse');

// update customer and/or subscription and/or subscription item,
// as determined by the body provided
module.exports.put = async (event, context, callback) => {
  let error = null;
  const { accessToken } = event.query;

  try {
    await testAuth(accessToken);
  } catch (errorCatch) {
    error = errorCatch;
  }

  if (!error) {
    try {
      await loadStripe();
    } catch (errorCatch) {
      error = errorCatch;
    }
  }

  const { body } = event;

  const customerId = event.cognitoPoolClaims.stripe_customer_id;
  let sourceId = null;
  let subscriptionId = null;
  let couponId = null;
  let plan = null;

  if (!error && body.email) {
    try {
      console.log('testUser\n', body.email, '\n', customerId, '\n');

      await testUser(body.email, customerId);
    } catch (errorCatch) {
      error = errorCatch;
    }
  }

  if (!error && body.promoCode) {
    try {
      console.log('testCoupon\n', body.promoCode, '\n');

      await testCoupon(body.promoCode);
    } catch (errorCatch) {
      error = errorCatch;
    }
  }

  if (!error) {
    try {
      console.log('getCustomer\n', customerId, '\n');

      ({
        sourceId, subscriptionId, couponId, plan,
      } = await getCustomer(customerId));

      console.log(
        'getCustomer - success\n',
        sourceId,
        '\n',
        subscriptionId,
        '\n',
        couponId,
        '\n',
        plan,
        '\n',
      );

      if (!sourceId || !subscriptionId || !plan) {
        error = `getCustomer - field missing
      sourceId: ${sourceId}
      subscriptionId: ${subscriptionId}
      plan: ${plan}`;
      }
    } catch (errorCatch) {
      error = errorCatch;
    }
  }

  if (!error && (body.token || body.email)) {
    try {
      console.log('updateCustomer\n', customerId, '\n', body, '\n');

      await updateCustomer(customerId, body);
    } catch (errorCatch) {
      error = errorCatch;
    }
  }

  if (!error && (!body.plan || body.plan === plan)) {
    if (body.promoCode) {
      try {
        console.log('updateSubscription\n', subscriptionId, '\n', body, '\n');

        await updateSubscription(subscriptionId, body);
      } catch (errorCatch) {
        error = errorCatch;
      }
    } else if (
      Object.prototype.hasOwnProperty.call(body, 'promoCode') &&
      !body.promoCode &&
      couponId
    ) {
      try {
        console.log('deleteDiscount\n', subscriptionId, '\n');

        await deleteDiscount(subscriptionId);
      } catch (errorCatch) {
        error = errorCatch;
      }
    }
  }

  if (!error && body.plan && body.plan !== plan) {
    try {
      console.log('deleteSubscription\n', subscriptionId, '\n', body, '\n');

      await deleteSubscription(subscriptionId);
    } catch (errorCatch) {
      error = errorCatch;
    }

    if (!error) {
      try {
        console.log('addSubscription\n', customerId, '\n', body, '\n');

        await addSubscription(customerId, body);
      } catch (errorCatch) {
        error = errorCatch;
      }
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
