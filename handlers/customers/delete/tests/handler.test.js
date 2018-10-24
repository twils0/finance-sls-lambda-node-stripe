const { loadStripe } = require('../../../../functions/stripe/loadStripe');
const { deleteCustomer } = require('../../../../functions/stripe/deleteCustomer');

const deleteExport = require('../handler');

const deleteModule = deleteExport.delete;

global.console.log = jest.fn();
jest.mock('../../../../functions/stripe/loadStripe', () => ({
  loadStripe: jest.fn(),
}));
jest.mock('../../../../functions/stripe/deleteCustomer', () => ({
  deleteCustomer: jest.fn(),
}));
jest.mock('../../../../functions/errorResponse', () => ({
  errorResponse: jest.fn(error => error),
}));

const event = {
  cognitoPoolClaims: {
    stripe_customer_id: 'testCustomerID',
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
    describe('delete', () => {
      afterEach(() => {
        loadStripe.mockReset();
        deleteCustomer.mockReset();
        global.console.log.mockReset();
        callback.mockReset();
      });

      it('fails and returns error, when loadStripe throws error', async () => {
        const error = {
          code: 'testCode',
          message: 'testMessage',
        };
        loadStripe.mockReturnValue(Promise.reject(error));

        await deleteModule(event, null, callback);

        expect(callback).toBeCalledWith(error, response);
        expect(global.console.log).toMatchSnapshot();
      });

      it('fails and returns error, when deleteCustomer throws error', async () => {
        const error = {
          code: 'testCode',
          message: 'testMessage',
        };
        loadStripe.mockReturnValue(Promise.resolve());
        deleteCustomer.mockReturnValue(Promise.reject(error));

        await deleteModule(event, null, callback);

        expect(deleteCustomer).toBeCalledWith(event.cognitoPoolClaims.stripe_customer_id);
        expect(callback).toBeCalledWith(error, response);
        expect(global.console.log).toMatchSnapshot();
      });

      it('correctly deletes user', async () => {
        loadStripe.mockReturnValue(Promise.resolve());
        deleteCustomer.mockReturnValue(Promise.resolve());

        await deleteModule(event, null, callback);

        expect(deleteCustomer).toBeCalledWith(event.cognitoPoolClaims.stripe_customer_id);
        expect(callback).toBeCalledWith(null, response);
        expect(global.console.log).toMatchSnapshot();
      });
    });
  });
});
