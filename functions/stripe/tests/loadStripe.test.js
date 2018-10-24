const stripe = require('stripe');
const { getSecret } = require('../../aws/getSecret');

const { loadStripe } = require('../loadStripe');

global.console.log = jest.fn();
jest.mock('../../aws/getSecret', () => ({
  getSecret: jest.fn(),
}));
jest.mock('stripe', () => jest.fn());

const stripeObject = { test: 'testStripe' };
stripe.mockReturnValue(stripeObject);

const getSecretValue = {
  sk: 'testSK',
};

describe('functions', () => {
  describe('db', () => {
    describe('loadStripe', () => {
      afterEach(() => {
        getSecret.mockReset();
        global.console.log.mockReset();
      });

      it('fails and returns unexpected error, when getSecret throws error', async () => {
        const error = {
          code: 'testCode',
          message: 'testMessage',
        };
        getSecret.mockReturnValue(Promise.reject(error));

        try {
          await loadStripe();
        } catch (errorCatch) {
          expect(errorCatch).toEqual(error);
        }
      });

      it('fails and returns unexpected error, when getSecret does not return a value', async () => {
        getSecret.mockReturnValue(Promise.resolve());

        try {
          await loadStripe();
        } catch (errorCatch) {
          expect(errorCatch).toMatchSnapshot();
        }
      });

      it('correctly loads stripe', async () => {
        getSecret.mockReturnValue(Promise.resolve({ value: getSecretValue }));

        const result = await loadStripe();

        expect(result).toEqual(null);
        expect(global.stripe).toEqual(stripeObject);
        expect(global.console.log).toMatchSnapshot();
      });
    });
  });
});
