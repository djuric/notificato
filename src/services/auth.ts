import * as UserTypes from '../types/user';
import config from 'config';
import jwt from 'jsonwebtoken';

const TOKEN_EXPIRES_IN = '1 day';

export const verifyToken = (token: string): Error | UserTypes.tokenData => {
  try {
    const decoded = jwt.verify(token, config.get('jwtPrivateKey'));
    return decoded as UserTypes.tokenData;
  } catch {
    return new Error('Invalid token.');
  }
};

export async function generateToken(userData: UserTypes.User): Promise<string> {
  const tokenData: UserTypes.tokenData = {
    id: userData.id,
    email: userData.email,
    role: userData.role,
  };

  return jwt.sign(tokenData, config.get('jwtPrivateKey'), {
    expiresIn: TOKEN_EXPIRES_IN,
  });
}
