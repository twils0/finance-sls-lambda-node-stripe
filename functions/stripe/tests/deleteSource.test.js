const deleteSourceExport = require('../deleteSource');

const deleteSourceModule = deleteSourceExport.deleteSource;

const deleteSource = jest.fn();
global.stripe = {
  customers: {
    deleteSource,
  },
};

const customerId = 'testCustomerID';
const sourceId = 'testSourceID';

describe('functions', () => {
  describe('aws', () => {
    describe('deleteSource', () => {
      afterEach(() => {
        deleteSource.mockReset();
      });

      it('fails and returns callback error', async () => {
        const error = {
          code: 'testCode',
          message: 'testMessage',
        };
        deleteSource.mockImplementation((cusId, sId, callback) => {
          expect(cusId).toEqual(customerId);
          expect(sId).toEqual(sourceId);
          callback(error);
        });

        try {
          await deleteSourceModule(customerId, sourceId);
        } catch (errorCatch) {
          expect(errorCatch).toEqual(error);
        }

        expect(deleteSource).toBeCalled();
      });

      it('correctly deletes source', async () => {
        deleteSource.mockImplementation((cusId, sId, callback) => {
          expect(cusId).toEqual(customerId);
          expect(sId).toEqual(sourceId);
          callback(null);
        });

        const result = await deleteSourceModule(customerId, sourceId);

        expect(deleteSource).toBeCalled();
        expect(result).toEqual(null);
      });
    });
  });
});
