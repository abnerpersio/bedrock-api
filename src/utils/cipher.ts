import {
  createCipheriv,
  scryptSync,
  createDecipheriv,
  randomBytes,
} from 'crypto';

const algorithm = 'aes-192-cbc';

const Cryptograph = (secret: string|null, password: string|null): string => {
  if (!secret || !password) {
    throw new Error('invalid parameters');
  }

  const key = scryptSync(password, 'salt', 24);
  const iv = randomBytes(16);

  const cipher = createCipheriv(algorithm, key, iv);
  const encrypted = Buffer.concat([cipher.update(secret), cipher.final()]);

  return `${encrypted.toString('hex')}.${iv.toString('hex')}`;
};

const Decryptograph = (encrypted: string|null, password: string|null): string => {
  if (!encrypted || !password) {
    throw new Error('invalid parameters');
  }

  const [secret, iv] = encrypted?.split('.');
  const key = scryptSync(password, 'salt', 24);

  if (!secret || !iv) {
    throw new Error('invalid encrypted');
  }

  const decipher = createDecipheriv(algorithm, key, Buffer.from(iv, 'hex'));
  const decrypted = Buffer.concat([decipher.update(Buffer.from(secret, 'hex')), decipher.final()]);

  return decrypted.toString();
};

export default {
  encrypt: Cryptograph,
  decrypt: Decryptograph,
};