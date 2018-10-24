// delete a discount from a subscription
module.exports.deleteDiscount = async (subscriptionId) => {
  try {
    await new Promise((resolve, reject) => {
<<<<<<< HEAD
      stripe.subscriptions.deleteDiscount(subscriptionId, (error) => {
        if (error) {
          reject(error);
=======
      global.stripe.subscriptions.deleteDiscount(subscriptionId, (errorCallback) => {
        if (errorCallback) {
          reject(errorCallback);
>>>>>>> d9dac27... cloned stripe lambda functions from finance project
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
