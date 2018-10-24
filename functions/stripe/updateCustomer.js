// update a customer to add a new payment source (credit card) or email,
// returning a new sourceId, if relevant
module.exports.updateCustomer = async (customerIdReq, payload) => {
  let customerId = null;
  let sourceId = null;
  const stripePayload = {};
  if (payload.token) {
    stripePayload.source = payload.token;
  }
  if (payload.email) {
    stripePayload.email = payload.email;
  }

  if (Object.keys(stripePayload).length > 0) {
    try {
      const customer = await new Promise((resolve, reject) => {
        global.stripe.customers.update(customerIdReq, stripePayload, (error, response) => {
          if (error) {
            reject(error);
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
  }

  return { customerId, sourceId };
};
