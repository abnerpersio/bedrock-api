import cipher from '../cipher';

describe('Criptograph test', () => {
  test('It should cryptograph a secret', () => {
    const secret = 'secret';
    const password = 'password';

    const encrypt = cipher.encrypt(secret, password);
    const decrypt = cipher.decrypt(encrypt, password);

    expect(decrypt).toBe(secret);
  });

  test('It should throw error with wrong password', () => {
    const secret = 'secret';
    const password = 'password';

    const encrypted = cipher.encrypt(secret, password);

    expect(() => cipher.decrypt(encrypted, 'wrongpass')).toThrow();
  });
});
