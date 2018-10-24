// retreive all relevant customer information
module.exports.getCustomer = async (customerId) => {
  let sourceId = null;
  let nameOnCard = null;
  let subscriptionId = null;
  let subscriptionItemId = null;
  let plan = null;
  let couponId = null;
  let couponValid = null;

  try {
    const customer = await new Promise((resolve, reject) => {
      global.stripe.customers.retrieve(customerId, (error, response) => {
        if (error) {
          reject(error);
        } else {
          resolve(response);
        }
      });
    });

    sourceId = customer.sources.data[0].id;
    nameOnCard = customer.sources.data[0].name;
    subscriptionId = customer.subscriptions.data[0].id;
    subscriptionItemId = customer.subscriptions.data[0].items.data[0].id;
    plan = customer.subscriptions.data[0].items.data[0].plan.id;

    if (customer.subscriptions.data[0].discount) {
      couponId = customer.subscriptions.data[0].discount.coupon.id;
      couponValid = customer.subscriptions.data[0].discount.coupon.valid;

      if (!couponId) {
        return Promise.reject('getCustomer - missing couponId', '\n');
      }
      if (couponValid === undefined) {
        return Promise.reject('getCustomer - missing couponValid', '\n');
      }
    }
  } catch (error) {
    return Promise.reject(error);
  }

  if (!sourceId) {
    return Promise.reject('getCustomer - missing sourceId', '\n');
  }
  if (!nameOnCard) {
    return Promise.reject('getCustomer - missing nameOnCard', '\n');
  }
  if (!subscriptionId) {
    return Promise.reject('getCustomer - missing subscriptionId', '\n');
  }
  if (!subscriptionItemId) {
    return Promise.reject('getCustomer - missing subscriptionItemId', '\n');
  }
  if (!plan) {
    return Promise.reject('getCustomer - missing plan', '\n');
  }

  return {
    sourceId,
    nameOnCard,
    subscriptionId,
    subscriptionItemId,
    plan,
    couponId,
    couponValid,
  };
};
