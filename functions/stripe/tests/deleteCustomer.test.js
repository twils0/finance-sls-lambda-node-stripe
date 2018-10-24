const { deleteCustomer } = require('../deleteCustomer');

const del = jest.fn();
global.stripe = {
  customers: {
    del,
  },
};

const customerId = 'testCustomerID';

describe('functions', () => {
  describe('aws', () => {
    describe('deleteCustomer', () => {
      afterEach(() => {
        del.mockReset();
      });

      it('fails and returns callback error', async () => {
        const error = {
          code: 'testCode',
          message: 'testMessage',
        };
        del.mockImplementation((id, callback) => {
          expect(id).toEqual(customerId);
          callback(error);
        });

        try {
          await deleteCustomer(customerId);
        } catch (errorCatch) {
          expect(errorCatch).toEqual(error);
        }

        expect(del).toBeCalled();
      });

      it('correctly deletes customer', async () => {
        del.mockImplementation((id, callback) => {
          expect(id).toEqual(customerId);
          callback(null);
        });

        const result = await deleteCustomer(customerId);

        expect(del).toBeCalled();
        expect(result).toEqual(null);
      });
    });
  });
});
