const { addCustomer } = require('../addCustomer');

const create = jest.fn();
global.stripe = {
  customers: {
    create,
  },
};

const token = { test: 'testToken' };
const email = 'test@test.com';
const customerId = 'testCustomerID';
const sourceId = 'testSourceID';
const payload = {
  token,
  email,
};
const expectedPayload = {
  source: token,
  email,
};
const customer = {
  id: customerId,
  sources: {
    data: [
      {
        id: sourceId,
      },
    ],
  },
};

describe('functions', () => {
  describe('aws', () => {
    describe('addCustomer', () => {
      afterEach(() => {
        create.mockReset();
      });

      it('fails and returns callback error', async () => {
        const error = {
          code: 'testCode',
          message: 'testMessage',
        };
        create.mockImplementation((stripePayload, callback) => {
          expect(stripePayload).toEqual(expectedPayload);
          callback(error);
        });

        try {
          await addCustomer(payload);
        } catch (errorCatch) {
          expect(errorCatch).toEqual(error);
        }

        expect(create).toBeCalled();
      });

      it('correctly returns customer object', async () => {
        create.mockImplementation((stripePayload, callback) => {
          expect(stripePayload).toEqual(expectedPayload);
          callback(null, customer);
        });

        const result = await addCustomer(payload);

        expect(create).toBeCalled();
        expect(result.customerId).toEqual(customerId);
        expect(result.sourceId).toEqual(sourceId);
      });
    });
  });
});
