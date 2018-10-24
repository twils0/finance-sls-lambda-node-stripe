// add a customer to Stripe account
module.exports.addCustomer = async (payload) => {
  let customerId = null;
  let sourceId = null;

  const stripePayload = {
    source: payload.token,
    email: payload.email,
  };

  try {
    const customer = await new Promise((resolve, reject) => {
<<<<<<< HEAD
      stripe.customers.create(stripePayload, (error, response) => {
        if (error) {
          reject(error);
=======
      global.stripe.customers.create(stripePayload, (errorCallback, response) => {
        if (errorCallback) {
          reject(errorCallback);
>>>>>>> d9dac27... cloned stripe lambda functions from finance project
        } else {
          resolve(response);
        }
      });
    });

    customerId = customer.id;
    sourceId = customer.sources.data[0].id;
  } catch (error) {
    return Promise.reject(error);
  }

  return { customerId, sourceId };
};
