const deleteDiscountExport = require('../deleteDiscount');

const deleteDiscountModule = deleteDiscountExport.deleteDiscount;

const deleteDiscount = jest.fn();
global.stripe = {
  subscriptions: {
    deleteDiscount,
  },
};

const subscriptionId = 'testSubscriptionID';

describe('functions', () => {
  describe('aws', () => {
    describe('deleteDiscount', () => {
      afterEach(() => {
        deleteDiscount.mockReset();
      });

      it('fails and returns callback error', async () => {
        const error = {
          code: 'testCode',
          message: 'testMessage',
        };
        deleteDiscount.mockImplementation((id, callback) => {
          expect(id).toEqual(subscriptionId);
          callback(error);
        });

        try {
          await deleteDiscountModule(subscriptionId);
        } catch (errorCatch) {
          expect(errorCatch).toEqual(error);
        }

        expect(deleteDiscount).toBeCalled();
      });

      it('correctly deletes discount', async () => {
        deleteDiscount.mockImplementation((id, callback) => {
          expect(id).toEqual(subscriptionId);
          callback(null);
        });

        const result = await deleteDiscountModule(subscriptionId);

        expect(deleteDiscount).toBeCalled();
        expect(result).toEqual(null);
      });
    });
  });
});
