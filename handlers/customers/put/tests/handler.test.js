const { testAuth } = require('../../../../functions/aws/testAuth');
const { loadStripe } = require('../../../../functions/stripe/loadStripe');
const { testUser } = require('../../../../functions/aws/testUser');
const { testCoupon } = require('../../../../functions/stripe/testCoupon');
const { getCustomer } = require('../../../../functions/stripe/getCustomer');
const { updateCustomer } = require('../../../../functions/stripe/updateCustomer');
const { updateSubscription } = require('../../../../functions/stripe/updateSubscription');
const { deleteDiscount } = require('../../../../functions/stripe/deleteDiscount');
const { deleteSubscription } = require('../../../../functions/stripe/deleteSubscription');
const { addSubscription } = require('../../../../functions/stripe/addSubscription');

const { put } = require('../handler');

global.console.log = jest.fn();
jest.mock('../../../../functions/aws/testAuth', () => ({
  testAuth: jest.fn(),
}));
jest.mock('../../../../functions/stripe/loadStripe', () => ({
  loadStripe: jest.fn(),
}));
jest.mock('../../../../functions/aws/testUser', () => ({
  testUser: jest.fn(),
}));
jest.mock('../../../../functions/stripe/testCoupon', () => ({
  testCoupon: jest.fn(),
}));
jest.mock('../../../../functions/stripe/getCustomer', () => ({
  getCustomer: jest.fn(),
}));
jest.mock('../../../../functions/stripe/updateCustomer', () => ({
  updateCustomer: jest.fn(),
}));
jest.mock('../../../../functions/stripe/updateSubscription', () => ({
  updateSubscription: jest.fn(),
}));
jest.mock('../../../../functions/stripe/deleteDiscount', () => ({
  deleteDiscount: jest.fn(),
}));
jest.mock('../../../../functions/stripe/deleteSubscription', () => ({
  deleteSubscription: jest.fn(),
}));
jest.mock('../../../../functions/stripe/addSubscription', () => ({
  addSubscription: jest.fn(),
}));
jest.mock('../../../../functions/aws/sns/publishSNS', () => ({
  publishSNS: jest.fn(),
}));
jest.mock('../../../../functions/errorResponse', () => ({
  errorResponse: jest.fn(error => error),
}));

const accessToken = 'testAccessToken';
const customerId = 'testCustomerID';
const sourceId = 'testSourceID';
const subscriptionId = 'testSubscriptionID';
const subscriptionItemId = 'testSubscriptionItemID';
const couponId = 'testCouponID';

const token = { test: 'testToken' };
const promoCode = 'testPromoCode';
const plan = 'basic_plan';
const email = 'test@test.com';
const name = 'testName';
const phone = '239-555-0000';

const event = {
  query: {
    accessToken,
  },
  cognitoPoolClaims: {
    stripe_customer_id: customerId,
  },
  body: {
    token,
    promoCode,
    plan,
    email,
    name,
    phone,
  },
};
const noPromoCodeEvent = {
  query: {
    accessToken,
  },
  cognitoPoolClaims: {
    stripe_customer_id: customerId,
  },
  body: {
    token,
    promoCode: null,
    plan,
    email,
    name,
    phone,
  },
};
const response = {
  status: 200,
  body: {
    message: 'success',
  },
};
const callback = jest.fn();

describe('handlers', () => {
  describe('users', () => {
    describe('put', () => {
      afterEach(() => {
        loadStripe.mockReset();
        testAuth.mockReset();
        testUser.mockReset();
        testCoupon.mockReset();
        getCustomer.mockReset();
        updateCustomer.mockReset();
        updateSubscription.mockReset();
        deleteDiscount.mockReset();
        deleteSubscription.mockReset();
        addSubscription.mockReset();
        global.console.log.mockReset();
        callback.mockReset();
      });

      it('fails and returns error, when testAuth throws error', async () => {
        const error = {
          code: 'testCode',
          message: 'testMessage',
        };
        testAuth.mockReturnValue(Promise.reject(error));

        await put(event, null, callback);

        expect(testAuth).toBeCalledWith(accessToken);
        expect(callback).toBeCalledWith(error, response);
        expect(global.console.log).toMatchSnapshot();
      });

      it('fails and returns error, when loadStripe throws error', async () => {
        const error = {
          code: 'testCode',
          message: 'testMessage',
        };
        testAuth.mockReturnValue(Promise.resolve());
        loadStripe.mockReturnValue(Promise.reject(error));

        await put(event, null, callback);

        expect(testAuth).toBeCalledWith(accessToken);
        expect(loadStripe).toBeCalled();
        expect(callback).toBeCalledWith(error, response);
        expect(global.console.log).toMatchSnapshot();
      });

      it('fails and returns error, when testUser throws error', async () => {
        const error = {
          code: 'testCode',
          message: 'testMessage',
        };
        testAuth.mockReturnValue(Promise.resolve());
        loadStripe.mockReturnValue(Promise.resolve());
        testUser.mockReturnValue(Promise.reject(error));

        await put(event, null, callback);

        expect(testAuth).toBeCalledWith(accessToken);
        expect(loadStripe).toBeCalled();
        expect(testUser).toBeCalledWith(email, customerId);
        expect(callback).toBeCalledWith(error, response);
        expect(global.console.log).toMatchSnapshot();
      });

      it('fails and returns error, when testCoupon throws error and no email in body', async () => {
        const noEmailEvent = {
          query: {
            accessToken,
          },
          cognitoPoolClaims: {
            stripe_customer_id: customerId,
          },
          body: {
            token,
            plan,
            promoCode,
            name,
            phone,
          },
        };
        const error = {
          code: 'testCode',
          message: 'testMessage',
        };
        testAuth.mockReturnValue(Promise.resolve());
        loadStripe.mockReturnValue(Promise.resolve());
        testCoupon.mockReturnValue(Promise.reject(error));

        await put(noEmailEvent, null, callback);

        expect(testAuth).toBeCalledWith(accessToken);
        expect(loadStripe).toBeCalled();
        expect(testUser).not.toBeCalled();
        expect(testCoupon).toBeCalledWith(promoCode);
        expect(callback).toBeCalledWith(error, response);
        expect(global.console.log).toMatchSnapshot();
      });

      it('fails and returns error, when getCustomer throws error and no promo code in body', async () => {
        const error = {
          code: 'testCode',
          message: 'testMessage',
        };
        testAuth.mockReturnValue(Promise.resolve());
        loadStripe.mockReturnValue(Promise.resolve());
        testUser.mockReturnValue(Promise.resolve());
        getCustomer.mockReturnValue(Promise.reject(error));

        await put(noPromoCodeEvent, null, callback);

        expect(testAuth).toBeCalledWith(accessToken);
        expect(loadStripe).toBeCalled();
        expect(testUser).toBeCalledWith(email, customerId);
        expect(testCoupon).not.toBeCalled();
        expect(getCustomer).toBeCalledWith(customerId);
        expect(callback).toBeCalledWith(error, response);
        expect(global.console.log).toMatchSnapshot();
      });

      it('fails and returns error, when updateCustomer throws error', async () => {
        const error = {
          code: 'testCode',
          message: 'testMessage',
        };
        testAuth.mockReturnValue(Promise.resolve());
        loadStripe.mockReturnValue(Promise.resolve());
        testUser.mockReturnValue(Promise.resolve());
        testCoupon.mockReturnValue(Promise.resolve());
        getCustomer.mockReturnValue(Promise.resolve({
          sourceId,
          subscriptionId,
          subscriptionItemId,
          couponId,
          plan,
        }));
        updateCustomer.mockReturnValue(Promise.reject(error));

        await put(event, null, callback);

        expect(testAuth).toBeCalledWith(accessToken);
        expect(loadStripe).toBeCalled();
        expect(testUser).toBeCalledWith(email, customerId);
        expect(testCoupon).toBeCalledWith(promoCode);
        expect(getCustomer).toBeCalledWith(customerId);
        expect(updateCustomer).toBeCalledWith(customerId, event.body);
        expect(callback).toBeCalledWith(error, response);
        expect(global.console.log).toMatchSnapshot();
      });

      it('fails and returns error, when updateSubscription throws error and no token or email', async () => {
        const noTokenEmailEvent = {
          query: {
            accessToken,
          },
          cognitoPoolClaims: {
            stripe_customer_id: customerId,
          },
          body: {
            test: 'test',
            promoCode,
            plan,
            name,
            phone,
          },
        };
        const error = {
          code: 'testCode',
          message: 'testMessage',
        };
        testAuth.mockReturnValue(Promise.resolve());
        loadStripe.mockReturnValue(Promise.resolve());
        testCoupon.mockReturnValue(Promise.resolve());
        getCustomer.mockReturnValue(Promise.resolve({
          sourceId,
          subscriptionId,
          subscriptionItemId,
          couponId,
          plan,
        }));
        updateSubscription.mockReturnValue(Promise.reject(error));

        await put(noTokenEmailEvent, null, callback);

        expect(testAuth).toBeCalledWith(accessToken);
        expect(loadStripe).toBeCalled();
        expect(testUser).not.toBeCalled();
        expect(testCoupon).toBeCalledWith(promoCode);
        expect(getCustomer).toBeCalledWith(customerId);
        expect(updateCustomer).not.toBeCalled();
        expect(updateSubscription).toBeCalledWith(subscriptionId, noTokenEmailEvent.body);
        expect(callback).toBeCalledWith(error, response);
        expect(global.console.log).toMatchSnapshot();
      });

      it('fails and returns error, when deleteDiscount throws error and null promo code', async () => {
        const error = {
          code: 'testCode',
          message: 'testMessage',
        };
        testAuth.mockReturnValue(Promise.resolve());
        loadStripe.mockReturnValue(Promise.resolve());
        testUser.mockReturnValue(Promise.resolve());
        getCustomer.mockReturnValue(Promise.resolve({
          sourceId,
          subscriptionId,
          subscriptionItemId,
          couponId,
          plan,
        }));
        updateCustomer.mockReturnValue(Promise.resolve());
        deleteDiscount.mockReturnValue(Promise.reject(error));

        await put(noPromoCodeEvent, null, callback);

        expect(testAuth).toBeCalledWith(accessToken);
        expect(loadStripe).toBeCalled();
        expect(testUser).toBeCalledWith(email, customerId);
        expect(testCoupon).not.toBeCalled();
        expect(getCustomer).toBeCalledWith(customerId);
        expect(updateCustomer).toBeCalledWith(customerId, noPromoCodeEvent.body);
        expect(updateSubscription).not.toBeCalled();
        expect(deleteDiscount).toBeCalledWith(subscriptionId);
        expect(callback).toBeCalledWith(error, response);
        expect(global.console.log).toMatchSnapshot();
      });

      it('fails and returns error, when deleteSubscription throws error, plan not null, and plan does not equal to current plan', async () => {
        const differentPlan = 'testDifferentPlan';
        const error = {
          code: 'testCode',
          message: 'testMessage',
        };
        testAuth.mockReturnValue(Promise.resolve());
        loadStripe.mockReturnValue(Promise.resolve());
        testUser.mockReturnValue(Promise.resolve());
        testCoupon.mockReturnValue(Promise.resolve());
        getCustomer.mockReturnValue(Promise.resolve({
          sourceId,
          subscriptionId,
          subscriptionItemId,
          couponId,
          plan: differentPlan,
        }));
        updateCustomer.mockReturnValue(Promise.resolve());
        deleteSubscription.mockReturnValue(Promise.reject(error));

        await put(event, null, callback);

        expect(testAuth).toBeCalledWith(accessToken);
        expect(loadStripe).toBeCalled();
        expect(testUser).toBeCalledWith(email, customerId);
        expect(testCoupon).toBeCalledWith(promoCode);
        expect(getCustomer).toBeCalledWith(customerId);
        expect(updateCustomer).toBeCalledWith(customerId, event.body);
        expect(updateSubscription).not.toBeCalled();
        expect(deleteDiscount).not.toBeCalled();
        expect(deleteSubscription).toBeCalledWith(subscriptionId);
        expect(callback).toBeCalledWith(error, response);
        expect(global.console.log).toMatchSnapshot();
      });

      it('fails and returns error, when addSubscription throws error, plan not null, and plan does not equal to current plan', async () => {
        const differentPlan = 'testDifferentPlan';
        const error = {
          code: 'testCode',
          message: 'testMessage',
        };
        testAuth.mockReturnValue(Promise.resolve());
        loadStripe.mockReturnValue(Promise.resolve());
        testUser.mockReturnValue(Promise.resolve());
        testCoupon.mockReturnValue(Promise.resolve());
        getCustomer.mockReturnValue(Promise.resolve({
          sourceId,
          subscriptionId,
          subscriptionItemId,
          couponId,
          plan: differentPlan,
        }));
        updateCustomer.mockReturnValue(Promise.resolve());
        deleteSubscription.mockReturnValue(Promise.resolve());
        addSubscription.mockReturnValue(Promise.reject(error));

        await put(event, null, callback);

        expect(testAuth).toBeCalledWith(accessToken);
        expect(loadStripe).toBeCalled();
        expect(testUser).toBeCalledWith(email, customerId);
        expect(testCoupon).toBeCalledWith(promoCode);
        expect(getCustomer).toBeCalledWith(customerId);
        expect(updateCustomer).toBeCalledWith(customerId, event.body);
        expect(updateSubscription).not.toBeCalled();
        expect(deleteDiscount).not.toBeCalled();
        expect(deleteSubscription).toBeCalledWith(subscriptionId);
        expect(addSubscription).toBeCalledWith(customerId, event.body);
        expect(callback).toBeCalledWith(error, response);
        expect(global.console.log).toMatchSnapshot();
      });

      it('correctly updates all stripe fields, except plan', async () => {
        testAuth.mockReturnValue(Promise.resolve());
        loadStripe.mockReturnValue(Promise.resolve());
        testUser.mockReturnValue(Promise.resolve());
        testCoupon.mockReturnValue(Promise.resolve());
        getCustomer.mockReturnValue(Promise.resolve({
          sourceId,
          subscriptionId,
          subscriptionItemId,
          couponId,
          plan,
        }));
        updateCustomer.mockReturnValue(Promise.resolve());
        deleteSubscription.mockReturnValue(Promise.resolve());
        addSubscription.mockReturnValue(Promise.resolve());

        await put(event, null, callback);

        expect(testAuth).toBeCalledWith(accessToken);
        expect(loadStripe).toBeCalled();
        expect(testUser).toBeCalledWith(email, customerId);
        expect(testCoupon).toBeCalledWith(promoCode);
        expect(getCustomer).toBeCalledWith(customerId);
        expect(updateCustomer).toBeCalledWith(customerId, event.body);
        expect(updateSubscription).toBeCalledWith(subscriptionId, event.body);
        expect(deleteDiscount).not.toBeCalled();
        expect(callback).toBeCalledWith(null, response);
        expect(global.console.log).toMatchSnapshot();
      });
    });
  });
});
