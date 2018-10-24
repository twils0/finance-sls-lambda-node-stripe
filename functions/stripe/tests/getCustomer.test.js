const { getCustomer } = require('../getCustomer');

const retrieve = jest.fn();
global.stripe = {
  customers: {
    retrieve,
  },
};

const customerId = 'testCustomerID';
const sourceId = 'testSourceID';
const nameOnCard = 'testNameOnCardID';
const subscriptionId = 'testSubscriptionID';
const subscriptionItemId = 'testSubscriptionItemID';
const plan = 'testPlan';
const couponId = 'testCouponID';
const couponValid = true;
const customer = {
  id: customerId,
  sources: {
    data: [
      {
        id: sourceId,
        name: nameOnCard,
      },
    ],
  },
  subscriptions: {
    data: [
      {
        id: subscriptionId,
        items: {
          data: [
            {
              id: subscriptionItemId,
              plan: {
                id: plan,
              },
            },
          ],
        },
        discount: {
          coupon: {
            id: couponId,
            valid: couponValid,
          },
        },
      },
    ],
  },
};

describe('functions', () => {
  describe('aws', () => {
    describe('getCustomer', () => {
      afterEach(() => {
        retrieve.mockReset();
      });

      it('fails and returns callback error', async () => {
        const error = {
          code: 'testCode',
          message: 'testMessage',
        };
        retrieve.mockImplementation((id, callback) => {
          expect(id).toEqual(customerId);
          callback(error);
        });

        try {
          await getCustomer(customerId);
        } catch (errorCatch) {
          expect(errorCatch).toEqual(error);
        }

        expect(retrieve).toBeCalled();
      });

      it('correctly returns customer object, when couponId and couponValid', async () => {
        retrieve.mockImplementation((id, callback) => {
          expect(id).toEqual(customerId);
          callback(null, customer);
        });

        const result = await getCustomer(customerId);

        expect(retrieve).toBeCalled();
        expect(result.sourceId).toEqual(sourceId);
        expect(result.nameOnCard).toEqual(nameOnCard);
        expect(result.subscriptionId).toEqual(subscriptionId);
        expect(result.subscriptionItemId).toEqual(subscriptionItemId);
        expect(result.plan).toEqual(plan);
        expect(result.couponId).toEqual(couponId);
        expect(result.couponValid).toEqual(couponValid);
      });

      it('correctly returns customer object', async () => {
        retrieve.mockImplementation((id, callback) => {
          expect(id).toEqual(customerId);
          callback(null, customer);
        });

        const result = await getCustomer(customerId);

        expect(retrieve).toBeCalled();
        expect(result.sourceId).toEqual(sourceId);
        expect(result.nameOnCard).toEqual(nameOnCard);
        expect(result.subscriptionId).toEqual(subscriptionId);
        expect(result.subscriptionItemId).toEqual(subscriptionItemId);
        expect(result.plan).toEqual(plan);
        expect(result.couponId).toEqual(couponId);
        expect(result.couponValid).toEqual(couponValid);
      });
    });
  });
});
