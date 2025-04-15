import { SignJWT, jwtVerify } from 'jose';
import { UserRole } from '../../types/auth';
import env from '../config/env';

const JWT_SECRET = new TextEncoder().encode(env.JWT_SECRET);
const JWT_EXPIRES_IN = '24h';

interface JWTPayload {
  sub: string;
  role: UserRole;
  email: string;
}

export const generateToken = async (payload: JWTPayload): Promise<string> => {
  const token = await new SignJWT({ ...payload })
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime(JWT_EXPIRES_IN)
    .sign(JWT_SECRET);

  return token;
};

export const verifyToken = async (token: string) => {
  try {
    const { payload } = await jwtVerify(token, JWT_SECRET);
    return payload as JWTPayload;
  } catch (error) {
    return null;
  }
};

export const extractTokenFromHeader = (header?: string): string | null => {
  if (!header || !header.startsWith('Bearer ')) {
    return null;
  }
  return header.split(' ')[1];
};