// delete a discount from a subscription
module.exports.deleteDiscount = async (subscriptionId) => {
  try {
    await new Promise((resolve, reject) => {
      global.stripe.subscriptions.deleteDiscount(subscriptionId, (errorCallback) => {
        if (errorCallback) {
          reject(errorCallback);
        } else {
          resolve();
        }
      });
    });
  } catch (error) {
    return Promise.reject(error);
  }

  return {};
};
