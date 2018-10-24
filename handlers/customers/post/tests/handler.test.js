const { loadStripe } = require('../../../../functions/stripe/loadStripe');
const { testUser } = require('../../../../functions/aws/testUser');
const { testCoupon } = require('../../../../functions/stripe/testCoupon');
const { addCustomer } = require('../../../../functions/stripe/addCustomer');
const { addSubscription } = require('../../../../functions/stripe/addSubscription');
const { publishSNS } = require('../../../../functions/aws/sns/publishSNS');

const { post } = require('../handler');

global.console.log = jest.fn();
jest.mock('../../../../functions/stripe/loadStripe', () => ({
  loadStripe: jest.fn(),
}));
jest.mock('../../../../functions/aws/testUser', () => ({
  testUser: jest.fn(),
}));
jest.mock('../../../../functions/stripe/testCoupon', () => ({
  testCoupon: jest.fn(),
}));
jest.mock('../../../../functions/stripe/addCustomer', () => ({
  addCustomer: jest.fn(),
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

const token = { test: 'testToken ' };
const promoCode = 'testPromoCode';
const plan = 'Basic_450';
const email = 'test@test.com';
const password = 'testPassword1!';
const name = 'testName';
const phone = '239-555-0000';
const customerId = 'testCustomerID';

const event = {
  body: {
    token,
    promoCode,
    plan,
    email,
    password,
    name,
    phone,
  },
};
const noPromoCodeEvent = {
  body: {
    token,
    plan,
    email,
    password,
    name,
    phone,
  },
};
const noPasswordEventBody = {
  token,
  promoCode,
  plan,
  email,
  name,
  phone,
};
const noPasswordNoPromoCodeEventBody = {
  token,
  plan,
  email,
  name,
  phone,
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
    describe('post', () => {
      afterEach(() => {
        loadStripe.mockReset();
        testUser.mockReset();
        testCoupon.mockReset();
        addCustomer.mockReset();
        addSubscription.mockReset();
        publishSNS.mockReset();
        global.console.log.mockReset();
        callback.mockReset();
      });

      it('fails and returns error, when loadStripe throws error', async () => {
        const error = {
          code: 'testCode',
          message: 'testMessage',
        };
        loadStripe.mockReturnValue(Promise.reject(error));

        await post(event, null, callback);

        expect(callback).toBeCalledWith(error, response);
        expect(global.console.log).toMatchSnapshot();
      });

      it("fails and throws an error when missing 'token' key in body", async () => {
        const emptyEvent = {
          status: 200,
          body: {},
        };
        loadStripe.mockReturnValue(Promise.resolve());
        callback.mockImplementation((error, resp) => {
          expect(error).toMatchSnapshot();
          expect(resp).toEqual(response);
        });

        await post(emptyEvent, null, callback);

        expect(global.console.log).toMatchSnapshot();
      });

      it("fails and throws an error when missing 'plan' key in body", async () => {
        const wrongEvent = {
          status: 200,
          body: {
            token,
          },
        };
        loadStripe.mockReturnValue(Promise.resolve());
        callback.mockImplementation((error, resp) => {
          expect(error).toMatchSnapshot();
          expect(resp).toEqual(response);
        });

        await post(wrongEvent, null, callback);

        expect(global.console.log).toMatchSnapshot();
      });

      it("fails and throws an error when missing 'email' key in body", async () => {
        const wrongEvent = {
          status: 200,
          body: {
            token,
            plan,
          },
        };
        loadStripe.mockReturnValue(Promise.resolve());
        callback.mockImplementation((error, resp) => {
          expect(error).toMatchSnapshot();
          expect(resp).toEqual(response);
        });

        await post(wrongEvent, null, callback);

        expect(global.console.log).toMatchSnapshot();
      });

      it("fails and throws an error when missing 'password' key in body", async () => {
        const wrongEvent = {
          status: 200,
          body: {
            token,
            plan,
            email,
          },
        };
        loadStripe.mockReturnValue(Promise.resolve());
        callback.mockImplementation((error, resp) => {
          expect(error).toMatchSnapshot();
          expect(resp).toEqual(response);
        });

        await post(wrongEvent, null, callback);

        expect(global.console.log).toMatchSnapshot();
      });

      it("fails and throws an error when missing 'phone' key in body", async () => {
        const wrongEvent = {
          status: 200,
          body: {
            token,
            plan,
            email,
            password,
          },
        };
        loadStripe.mockReturnValue(Promise.resolve());
        callback.mockImplementation((error, resp) => {
          expect(error).toMatchSnapshot();
          expect(resp).toEqual(response);
        });

        await post(wrongEvent, null, callback);

        expect(global.console.log).toMatchSnapshot();
      });

      it("fails and throws an error when missing 'name' key in body", async () => {
        const wrongEvent = {
          status: 200,
          body: {
            token,
            plan,
            email,
            password,
            phone,
          },
        };
        loadStripe.mockReturnValue(Promise.resolve());
        callback.mockImplementation((error, resp) => {
          expect(error).toMatchSnapshot();
          expect(resp).toEqual(response);
        });

        await post(wrongEvent, null, callback);

        expect(global.console.log).toMatchSnapshot();
      });

      it('fails and returns error, when testUser throws error', async () => {
        const error = {
          code: 'testCode',
          message: 'testMessage',
        };
        loadStripe.mockReturnValue(Promise.resolve());
        testUser.mockReturnValue(Promise.reject(error));

        await post(event, null, callback);

        expect(testUser).toBeCalledWith(email);
        expect(callback).toBeCalledWith(error, response);
        expect(global.console.log).toMatchSnapshot();
      });

      it('fails and returns error, when testCoupon throws error', async () => {
        const error = {
          code: 'testCode',
          message: 'testMessage',
        };
        loadStripe.mockReturnValue(Promise.resolve());
        testUser.mockReturnValue(Promise.resolve());
        testCoupon.mockReturnValue(Promise.reject(error));

        await post(event, null, callback);

        expect(testUser).toBeCalledWith(email);
        expect(callback).toBeCalledWith(error, response);
        expect(global.console.log).toMatchSnapshot();
      });

      it('fails and returns error, when addCustomer returns an error and does not call testCoupon when no promoCode', async () => {
        const error = {
          code: 'testCode',
          message: 'testMessage',
        };
        loadStripe.mockReturnValue(Promise.resolve());
        testUser.mockReturnValue(Promise.resolve());
        testCoupon.mockReturnValue(Promise.resolve());
        addCustomer.mockReturnValue(Promise.reject(error));

        await post(noPromoCodeEvent, null, callback);

        expect(testUser).toBeCalledWith(email);
        expect(testCoupon).not.toBeCalled();
        expect(addCustomer).toBeCalledWith(noPasswordNoPromoCodeEventBody);
        expect(callback).toBeCalledWith(error, response);
        expect(global.console.log).toMatchSnapshot();
      });

      it('fails and returns error, when addSubscription returns an error', async () => {
        const error = {
          code: 'testCode',
          message: 'testMessage',
        };
        loadStripe.mockReturnValue(Promise.resolve());
        testUser.mockReturnValue(Promise.resolve());
        testCoupon.mockReturnValue(Promise.resolve());
        addCustomer.mockReturnValue(Promise.resolve({ customerId }));
        addSubscription.mockReturnValue(Promise.reject(error));

        await post(event, null, callback);

        expect(testUser).toBeCalledWith(email);
        expect(testCoupon).toBeCalled();
        expect(addCustomer).toBeCalledWith(noPasswordEventBody);
        expect(addSubscription).toBeCalledWith(customerId, noPasswordEventBody);
        expect(callback).toBeCalledWith(error, response);
        expect(global.console.log).toMatchSnapshot();
      });

      it('fails and returns error, when publishSNS returns an error', async () => {
        const error = {
          code: 'testCode',
          message: 'testMessage',
        };
        loadStripe.mockReturnValue(Promise.resolve());
        testUser.mockReturnValue(Promise.resolve());
        testCoupon.mockReturnValue(Promise.resolve());
        addCustomer.mockReturnValue(Promise.resolve({ customerId }));
        addSubscription.mockReturnValue(Promise.resolve());
        publishSNS.mockReturnValue(Promise.reject(error));

        await post(event, null, callback);

        expect(testUser).toBeCalledWith(email);
        expect(testCoupon).toBeCalled();
        expect(addCustomer).toBeCalledWith(noPasswordEventBody);
        expect(addSubscription).toBeCalledWith(customerId, noPasswordEventBody);
        expect(publishSNS).toBeCalledWith(customerId, event.body);
        expect(callback).toBeCalledWith(error, response);
        expect(global.console.log).toMatchSnapshot();
      });

      it('correctly publishes an sns topic', async () => {
        loadStripe.mockReturnValue(Promise.resolve());
        testUser.mockReturnValue(Promise.resolve());
        testCoupon.mockReturnValue(Promise.resolve());
        addCustomer.mockReturnValue(Promise.resolve({ customerId }));
        addSubscription.mockReturnValue(Promise.resolve());
        publishSNS.mockReturnValue(Promise.resolve());

        await post(event, null, callback);

        expect(testUser).toBeCalledWith(email);
        expect(testCoupon).toBeCalled();
        expect(addCustomer).toBeCalledWith(noPasswordEventBody);
        expect(addSubscription).toBeCalledWith(customerId, noPasswordEventBody);
        expect(publishSNS).toBeCalledWith(customerId, event.body);
        expect(callback).toBeCalledWith(null, response);
        expect(global.console.log).toMatchSnapshot();
      });
    });
  });
});
