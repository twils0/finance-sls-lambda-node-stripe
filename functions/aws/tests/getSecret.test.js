const AWS = require('aws-sdk'); // eslint-disable-line

const { getSecret } = require('../getSecret');

const getSecretValue = jest.fn();

AWS.SecretsManager = jest.fn(() => ({
  getSecretValue,
}));

const key = 'testKey';

describe('functions', () => {
  describe('aws', () => {
    describe('getSecret', () => {
      afterEach(() => {
        getSecretValue.mockReset();
      });

      it('fails and returns callback error', async () => {
        const error = {
          code: 'testCode',
          message: 'testMessage',
        };
        getSecretValue.mockImplementation((params, callback) => {
          expect(params.SecretId).toEqual(key);
          callback(error);
        });

        try {
          await getSecret(key);
        } catch (errorCatch) {
          expect(errorCatch).toEqual(error);
        }
      });

      it('fails and returns unexpected error, missing secret string', async () => {
        const emptyResult = {};
        getSecretValue.mockImplementation((params, callback) => {
          expect(params.SecretId).toEqual(key);
          callback(null, emptyResult);
        });

        try {
          await getSecret(key);
        } catch (errorCatch) {
          expect(errorCatch).toMatchSnapshot();
        }
      });

      it('correctly returns secret value', async () => {
        const secretString = {
          key1: 'value1',
          key2: 'value2',
        };
        const result = {
          SecretString: JSON.stringify(secretString),
        };
        getSecretValue.mockImplementation((params, callback) => {
          expect(params.SecretId).toEqual(key);
          callback(null, result);
        });

        const { value } = await getSecret(key);

        expect(value).toEqual(secretString);
      });
    });
  });
});
