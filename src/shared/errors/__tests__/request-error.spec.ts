import { RequestError } from '../request-error';

describe(RequestError.name, () => {
  it('should create a request error with status', () => {
    const error = new RequestError('test error', 425);

    expect(error.statusCode).toBe(425);
    expect(error.message).toBe('test error');
  });

  it.each([[425000], [-20], [501], [520]])(
    'should return statusCode 500 with invalid status %#',
    (statusCode) => {
      const error = new RequestError('test error', statusCode);

      expect(error.statusCode).toBe(500);
      expect(error.message).toBe('test error');
    },
  );
});
