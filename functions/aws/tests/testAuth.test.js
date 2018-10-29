const AWS = require('aws-sdk'); // eslint-disable-line

const { testAuth } = require('../testAuth');

const getUser = jest.fn();

AWS.CognitoIdentityServiceProvider = jest.fn(() => ({
  getUser,
}));

const accessToken = 'testToken';

describe('functions', () => {
  describe('aws', () => {
    describe('testAuth', () => {
      afterEach(() => {
        getUser.mockReset();
      });

      it('fails and returns callback error', async () => {
        const error = {
          code: 'testCode',
          message: 'testMessage',
        };
        getUser.mockImplementation((params, callback) => callback(error));

        try {
          await testAuth(accessToken);
        } catch (errorCatch) {
          expect(errorCatch).toEqual(error);
        }
      });

      it('correctly resolves cognito get user', async () => {
        getUser.mockImplementation((params, callback) => callback(null, null));

        const result = await testAuth(accessToken);

        expect(result).toEqual(null);
      });
    });
  });
});
