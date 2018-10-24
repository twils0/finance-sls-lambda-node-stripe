const MockDate = require('mockdate');

const { addSubscription } = require('../addSubscription');

const create = jest.fn();
global.stripe = {
  subscriptions: {
    create,
  },
};

const customerId = 'testCustomerID';
const subscriptionId = 'testSubscriptionID';
const subscriptionItemId = 'testSubscriptionItemID';
const plan = 'basic_plan';
const promoCode = 'testPromoCode';
const payload = {
  plan,
  promoCode,
};
const noPromoCodePayload = {
  plan,
};
const subscription = {
  id: subscriptionId,
  items: {
    data: [
      {
        id: subscriptionItemId,
      },
    ],
  },
};

describe('functions', () => {
  describe('aws', () => {
    describe('addSubscription', () => {
      afterEach(() => {
        create.mockReset();
        MockDate.reset();
      });

      it('fails and returns callback error, month equals 1', async () => {
        const expectedDate = Date.UTC(2000, 0, 16) / 1000;
        const expectedPayload = {
          customer: customerId,
          coupon: promoCode,
          items: [
            {
              plan,
            },
          ],
          billing_cycle_anchor: expectedDate,
        };
        const error = {
          code: 'testCode',
          message: 'testMessage',
        };
        create.mockImplementation((stripePayload, callback) => {
          expect(stripePayload).toEqual(expectedPayload);
          callback(error);
        });

        const startDate = new Date('1/2/2000');

        MockDate.set(startDate);

        try {
          await addSubscription(customerId, payload);
        } catch (errorCatch) {
          expect(errorCatch).toEqual(error);
        }

        expect(create).toBeCalled();
      });

      it('correctly adds subscription, month equals 4, no promo code', async () => {
        const expectedDate = Date.UTC(2000, 3, 16) / 1000;
        const expectedPayload = {
          customer: customerId,
          items: [
            {
              plan,
            },
          ],
          billing_cycle_anchor: expectedDate,
        };
        create.mockImplementation((stripePayload, callback) => {
          expect(stripePayload).toEqual(expectedPayload);
          callback(null, subscription);
        });

        const startDate = new Date('4/2/2000');

        MockDate.set(startDate);

        const result = await addSubscription(customerId, noPromoCodePayload);

        expect(create).toBeCalled();
        expect(result.subscriptionId).toEqual(subscriptionId);
        expect(result.subscriptionItemId).toEqual(subscriptionItemId);
      });

      it('correctly adds subscription, month equals 7', async () => {
        const expectedDate = Date.UTC(2000, 6, 16) / 1000;
        const expectedPayload = {
          customer: customerId,
          coupon: promoCode,
          items: [
            {
              plan,
            },
          ],
          billing_cycle_anchor: expectedDate,
        };
        create.mockImplementation((stripePayload, callback) => {
          expect(stripePayload).toEqual(expectedPayload);
          callback(null, subscription);
        });

        const startDate = new Date('7/2/2000');

        MockDate.set(startDate);

        const result = await addSubscription(customerId, payload);

        expect(create).toBeCalled();
        expect(result.subscriptionId).toEqual(subscriptionId);
        expect(result.subscriptionItemId).toEqual(subscriptionItemId);
      });

      it('correctly adds subscription, month equals 10', async () => {
        const expectedDate = Date.UTC(2000, 9, 16) / 1000;
        const expectedPayload = {
          customer: customerId,
          coupon: promoCode,
          items: [
            {
              plan,
            },
          ],
          billing_cycle_anchor: expectedDate,
        };
        create.mockImplementation((stripePayload, callback) => {
          expect(stripePayload).toEqual(expectedPayload);
          callback(null, subscription);
        });

        const startDate = new Date('10/2/2000');

        MockDate.set(startDate);

        const result = await addSubscription(customerId, payload);

        expect(create).toBeCalled();
        expect(result.subscriptionId).toEqual(subscriptionId);
        expect(result.subscriptionItemId).toEqual(subscriptionItemId);
      });
    });
  });
});
