import { decrypt, encrypt } from '../crypto';

describe(encrypt.name, () => {
  it('should encrypt a secret', () => {
    const secret = 'secret';
    const key = 'password-for-encrypting';

    const encrypted = encrypt(secret, key);

    expect(encrypted).not.toBe(secret);
  });

  it.each([
    [null, 'key'],
    ['secret', null],
    [null, null],
  ])('should throw error if is missing params %#', (secret, key) => {
    expect(() => encrypt(secret, key)).toThrowError('invalid parameters');
  });
});

describe(decrypt.name, () => {
  it('should decrypt successfully', () => {
    const secret = 'secret';
    const key = 'key';

    const encrypted = encrypt(secret, key);
    const decrypted = decrypt(encrypted, key);

    expect(decrypted).toBe(secret);
  });

  it.each([
    [null, 'key'],
    ['secret', null],
    [null, null],
  ])('should get null if is missing params %#', (secret, key) => {
    const decrypted = decrypt(secret, key);
    expect(decrypted).toBeNull();
  });

  it('should throw error when decrypting with wrong password', () => {
    const secret = 'secret';
    const key = 'key';

    const encrypted = encrypt(secret, key);

    expect(() => decrypt(encrypted, 'wrong-or-invalid-key')).toThrow();
  });
});
