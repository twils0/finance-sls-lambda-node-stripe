const AWS = require('aws-sdk'); // eslint-disable-line

const { publishSNS } = require('../publishSNS');

jest.mock('../../aws.config.json', () => ({
  sns: {
    arn: 'testARN',
  },
}));

const publish = jest.fn();

AWS.SNS = jest.fn(() => ({
  publish,
}));

const customerId = 'testCustomerID';
const snsPayload = { test: 'testMessage' };
const expectedSnsPayload = {
  Message: JSON.stringify({ ...snsPayload, customerId }),
  TopicArn: 'testARN',
};

describe('functions', () => {
  describe('aws', () => {
    describe('sns', () => {
      describe('publishSNS', () => {
        afterEach(() => {
          publish.mockReset();
        });

        it('fails and returns unexpected error, with sns.publish fails', async () => {
          const error = {
            code: 'testCode',
            message: 'testMessage',
          };

          publish.mockImplementation((payload, callback) => {
            expect(payload).toEqual(expectedSnsPayload);
            callback(error);
          });

          try {
            await publishSNS(customerId, snsPayload);
          } catch (errorCatch) {
            expect(errorCatch).toEqual(error);
          }
        });

        it('correctly parses sns event', async () => {
          publish.mockImplementation((payload, callback) => {
            expect(payload).toEqual(expectedSnsPayload);
            callback();
          });

          const payload = await publishSNS(customerId, snsPayload);

          expect(payload).toEqual(null);
        });
      });
    });
  });
});
