// add a subscription to a customer,
// returning subscriptionId and subscriptionItemId
module.exports.addSubscription = async (customerId, payload) => {
  let subscriptionId = null;
  let subscriptionItemId = null;
  let stripePayload = null;

<<<<<<< HEAD
  if (payload.plan === 'Basic_300') {
=======
  // only currently offer basic_plan, billed quarterly
  // and prorated for the first quarter
  if (payload.plan === 'basic_plan') {
>>>>>>> d9dac27... cloned stripe lambda functions from finance project
    const currentDate = new Date();

    const month = currentDate.getUTCMonth();
    const year = currentDate.getUTCFullYear();
    let newMonth = null;
    const newDay = 16;

    if (month >= 0 && month < 3) {
      newMonth = 3;
    } else if (month >= 3 && month < 6) {
      newMonth = 6;
    } else if (month >= 6 && month < 9) {
      newMonth = 9;
    } else if (month >= 9 && month < 12) {
      newMonth = 0;
    }

    if (!newMonth) {
      Promise.reject('addSubscription - missing new month');
    }

    const subscriptionAnchorDate = Date.UTC(year, newMonth, newDay) / 1000;

    stripePayload = {
      customer: customerId,
      items: [
        {
          plan: payload.plan,
        },
      ],
      billing_cycle_anchor: subscriptionAnchorDate,
    };
  } else {
    return Promise.reject({
      code: 'plan_invalid',
      message: 'Please provide a valid subscription plan.',
    });
  }

  if (payload.promoCode) {
    stripePayload.coupon = payload.promoCode;
  }

  try {
    const subscription = await new Promise((resolve, reject) => {
      global.stripe.subscriptions.create(stripePayload, (error, response) => {
        if (error) {
          reject(error);
        } else {
          resolve(response);
        }
      });
    });

    subscriptionId = subscription.id;
    subscriptionItemId = subscription.items.data[0].id;
  } catch (error) {
    return Promise.reject(error);
  }

  return { subscriptionId, subscriptionItemId };
};
