const AWS = require('aws-sdk'); // eslint-disable-line

const { testUser } = require('../testUser');

const adminGetUser = jest.fn();

AWS.CognitoIdentityServiceProvider = jest.fn(() => ({
  adminGetUser,
}));

const email = 'test@test.com';
const userId = 'testUserID';

describe('functions', () => {
  describe('aws', () => {
    describe('testUser', () => {
      afterEach(() => {
        adminGetUser.mockReset();
      });

      it("correctly resolves adminGetUser when a 'UserNotFoundException' error is thrown", async () => {
        const error = {
          code: 'UserNotFoundException',
          message: 'testMessage',
        };
        adminGetUser.mockImplementation((params, callback) => callback(error));

        const result = await testUser(email);

        expect(result).toEqual(null);
      });

      it('fails and returns callback error', async () => {
        const error = {
          code: 'testCode',
          message: 'testMessage',
        };
        adminGetUser.mockImplementation((params, callback) => callback(error));

        try {
          await testUser(email);
        } catch (errorCatch) {
          expect(errorCatch).toEqual(error);
        }
      });

      it("fails and returns a 'UsernameExistsException' error when not provided a userId", async () => {
        const response = {
          UserAttributes: [
            {
              Name: 'testName',
              Value: 'testValue',
            },
          ],
        };
        adminGetUser.mockImplementation((params, callback) => callback(null, response));

        try {
          await testUser(email);
        } catch (errorCatch) {
          expect(errorCatch).toMatchSnapshot();
        }
      });

      it("fails and returns a 'UsernameExistsException' error when provided userId that does not match", async () => {
        const response = {
          UserAttributes: [
            {
              Name: 'custom:stripe_customer_id',
              Value: 'testValue',
            },
          ],
        };
        adminGetUser.mockImplementation((params, callback) => callback(null, response));

        try {
          await testUser(email);
        } catch (errorCatch) {
          expect(errorCatch).toMatchSnapshot();
        }
      });

      it('correctly resolves adminGetUser when provided userId that matches', async () => {
        const response = {
          UserAttributes: [
            {
              Name: 'custom:stripe_customer_id',
              Value: userId,
            },
          ],
        };
        adminGetUser.mockImplementation((params, callback) => callback(null, response));

        const result = await testUser(email, userId);

        expect(result).toEqual(null);
      });
    });
  });
});
