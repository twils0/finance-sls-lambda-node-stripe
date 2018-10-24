// delete a payment source (credit card) from a customer
module.exports.deleteSource = async (customerId, sourceId) => {
  try {
    await new Promise((resolve, reject) => {
      global.stripe.customers.deleteSource(customerId, sourceId, (error) => {
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
