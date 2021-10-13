import { createHash } from 'crypto';

export const hash = (pass: string): string => createHash('sha256').update(pass).digest('hex');

export const verifiyHash = (hashedPass: string, pass: string): boolean => createHash('sha256').update(pass).digest('hex') === hashedPass;
