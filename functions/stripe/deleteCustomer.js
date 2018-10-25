// delete a customer from Stripe account
module.exports.deleteCustomer = async (customerId) => {
  try {
    await new Promise((resolve, reject) => {
      global.stripe.customers.del(customerId, (errorCallback) => {
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

  return null;
};
