// test if the promo code provided is valid and has not expired
module.exports.testCoupon = async (couponId) => {
  let coupons = null;

  try {
    const couponObject = await new Promise((resolve, reject) => {
      global.stripe.coupons.list({}, (errorCallback, response) => {
        if (errorCallback) {
          reject(errorCallback);
        } else {
          resolve(response);
        }
      });
    });

    coupons = couponObject.data;
  } catch (error) {
    if (error.code === 'resource_missing') {
      return Promise.reject({
        code: 'coupon_invalid',
        message: 'Please enter a valid promo code.',
      });
    }
  }

  let error = {
    code: 'coupon_invalid',
    message: 'Please enter a valid promo code.',
  };

  coupons.forEach((coupon) => {
    if (couponId === coupon.id) {
      if (coupon.valid) {
        error = null;
      } else {
        error = {
          code: 'coupon_expired',
          message: 'This promo code is no longer valid.',
        };
      }
    }
  });

  if (error) {
    return Promise.reject(error);
  }

  return null;
};
