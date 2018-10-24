const { deleteSubscription } = require('../deleteSubscription');

const del = jest.fn();
global.stripe = {
  subscriptions: {
    del,
  },
};

const subscriptionId = 'testSubscriptionID';

describe('functions', () => {
  describe('aws', () => {
    describe('deleteSubscription', () => {
      afterEach(() => {
        del.mockReset();
      });

      it('fails and returns callback error', async () => {
        const error = {
          code: 'testCode',
          message: 'testMessage',
        };
        del.mockImplementation((id, callback) => {
          expect(id).toEqual(subscriptionId);
          callback(error);
        });

        try {
          await deleteSubscription(subscriptionId);
        } catch (errorCatch) {
          expect(errorCatch).toEqual(error);
        }

        expect(del).toBeCalled();
      });

      it('correctly deletes source', async () => {
        del.mockImplementation((id, callback) => {
          expect(id).toEqual(subscriptionId);
          callback(null);
        });

        const result = await deleteSubscription(subscriptionId);

        expect(del).toBeCalled();
        expect(result).toEqual(null);
      });
    });
  });
});
