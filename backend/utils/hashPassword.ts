import { randomBytes, scryptSync } from 'crypto';

export const hashPassword = (password: string): { hash: string; salt: string } => {
  const salt = randomBytes(16).toString('hex');
  const hash = scryptSync(password, salt, 64).toString('hex');
  return { hash, salt };
};

export const verifyPassword = (password: string, hash: string, salt: string): boolean => {
  const testHash = scryptSync(password, salt, 64).toString('hex');
  return testHash === hash;
};