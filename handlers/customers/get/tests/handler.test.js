const { testAuth } = require('../../../../functions/aws/testAuth');
const { loadStripe } = require('../../../../functions/stripe/loadStripe');
const { getCustomer } = require('../../../../functions/stripe/getCustomer');

const { get } = require('../handler');

global.console.log = jest.fn();
jest.mock('../../../../functions/aws/testAuth', () => ({
  testAuth: jest.fn(),
}));
jest.mock('../../../../functions/stripe/loadStripe', () => ({
  loadStripe: jest.fn(),
}));
jest.mock('../../../../functions/stripe/getCustomer', () => ({
  getCustomer: jest.fn(),
}));
jest.mock('../../../../functions/errorResponse', () => ({
  errorResponse: jest.fn(error => error),
}));

const accessToken = 'testAccessToken';
const event = {
  query: {
    accessToken,
  },
  cognitoPoolClaims: {
    stripe_customer_id: 'testUserID',
  },
};
const nameOnCard = 'testNameOnCard';
const couponId = 'testPromoCode';
const couponValid = true;
const response = {
  status: 200,
  body: {
    nameOnCard,
    promoCode: couponId,
    promoCodeValid: couponValid,
  },
};
const emptyResponse = {
  status: 200,
  body: {
    nameOnCard: null,
    promoCode: null,
    promoCodeValid: null,
  },
};
const callback = jest.fn();

describe('handlers', () => {
  describe('users', () => {
    describe('get', () => {
      afterEach(() => {
        loadStripe.mockReset();
        testAuth.mockReset();
        getCustomer.mockReset();
        global.console.log.mockReset();
        callback.mockReset();
      });

      it('fails and returns error, when testAuth throws error', async () => {
        const error = {
          code: 'testCode',
          message: 'testMessage',
        };
        testAuth.mockReturnValue(Promise.reject(error));

        await get(event, null, callback);

        expect(testAuth).toBeCalledWith(accessToken);
        expect(callback).toBeCalledWith(error, emptyResponse);
        expect(global.console.log).toMatchSnapshot();
      });

      it('fails and returns error, when loadStripe throws error', async () => {
        const error = {
          code: 'testCode',
          message: 'testMessage',
        };
        testAuth.mockReturnValue(Promise.resolve());
        loadStripe.mockReturnValue(Promise.reject(error));

        await get(event, null, callback);

        expect(callback).toBeCalledWith(error, emptyResponse);
        expect(global.console.log).toMatchSnapshot();
      });

      it('fails and returns error, when getCustomer returns an error', async () => {
        const error = {
          code: 'testCode',
          message: 'testMessage',
        };
        testAuth.mockReturnValue(Promise.resolve());
        loadStripe.mockReturnValue(Promise.resolve());
        getCustomer.mockReturnValue(Promise.reject(error));

        await get(event, null, callback);

        expect(testAuth).toBeCalledWith(accessToken);
        expect(loadStripe).toBeCalled();
        expect(getCustomer).toBeCalledWith(event.cognitoPoolClaims.stripe_customer_id);
        expect(callback).toBeCalledWith(error, emptyResponse);
        expect(global.console.log).toMatchSnapshot();
      });

      it('correctly responds with customer info', async () => {
        testAuth.mockReturnValue(Promise.resolve());
        loadStripe.mockReturnValue(Promise.resolve());
        getCustomer.mockReturnValue(Promise.resolve({ nameOnCard, couponId, couponValid }));

        await get(event, null, callback);

        expect(testAuth).toBeCalledWith(accessToken);
        expect(loadStripe).toBeCalled();
        expect(getCustomer).toBeCalledWith(event.cognitoPoolClaims.stripe_customer_id);
        expect(callback).toBeCalledWith(null, response);
        expect(global.console.log).toMatchSnapshot();
      });
    });
  });
});
