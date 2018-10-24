// update a subscription to add a coupon code
module.exports.updateSubscription = async (subscriptionId, payload) => {
  const stripePayload = {};

  if (payload.promoCode) {
    stripePayload.coupon = payload.promoCode;
  }

  if (Object.keys(stripePayload).length > 0) {
    try {
      await new Promise((resolve, reject) => {
        global.stripe.subscriptions.update(subscriptionId, stripePayload, (error) => {
          if (error) {
            reject(error);
          } else {
            resolve();
          }
        });
      });
    } catch (error) {
      return Promise.reject(error);
    }
  }

  return null;
};
