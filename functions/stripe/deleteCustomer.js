// delete a customer from Stripe account
module.exports.deleteCustomer = async (customerId) => {
  try {
    await new Promise((resolve, reject) => {
<<<<<<< HEAD
      stripe.customers.del(customerId, (error) => {
        if (error) {
          reject(error);
=======
      global.stripe.customers.del(customerId, (errorCallback) => {
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

  return null;
};
