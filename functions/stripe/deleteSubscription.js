// delete a subscription from a customer
module.exports.deleteSubscription = async (subscriptionId) => {
  try {
    await new Promise((resolve, reject) => {
      global.stripe.subscriptions.del(subscriptionId, (error) => {
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

  return null;
};
