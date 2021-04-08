import * as UserTypes from '../types/user';
import { User as UserEntity } from '../entities/user';
import { getManager } from 'typeorm';
import config from 'config';
import jwt from 'jsonwebtoken';

const TOKEN_EXPIRES_IN = '1 day';

function verifyToken(token: string): Error | UserTypes.tokenData {
  try {
    const decoded = jwt.verify(token, config.get('jwtPrivateKey'));
    return decoded as UserTypes.tokenData;
  } catch {
    return new Error('Invalid token.');
  }
}

async function authorize(
  userId: number,
  role: UserTypes.Role
): Promise<UserTypes.User | Error> {
  const user = await getManager().findOne(UserEntity, {
    id: userId,
  });

  if (user === undefined) {
    return new Error('User not found.');
  }

  if (user.role < role) {
    return new Error(
      "You don't have enough permissions to perform the requested operation."
    );
  }

  return user;
}

export async function generateToken(userData: UserTypes.User): Promise<string> {
  const tokenData: UserTypes.tokenData = {
    id: userData.id,
    email: userData.email,
  };

  return jwt.sign(tokenData, config.get('jwtPrivateKey'), {
    expiresIn: TOKEN_EXPIRES_IN,
  });
}

export const Authorize = (role = UserTypes.Role.Administrator) => (
  _: Object,
  _2: string,
  descriptor: PropertyDescriptor
) => {
  const originalMethod = descriptor.value;

  descriptor.value = async function (...args: any[]) {
    const isAuthenticated = verifyToken(args[1]);

    if (!(isAuthenticated instanceof Error)) {
      const isAuthorized = await authorize(isAuthenticated.id, role);

      if (!(isAuthorized instanceof Error)) {
        args[2] = isAuthorized;
        return originalMethod.apply(this, args);
      }

      return isAuthorized;
    }

    return isAuthenticated;
  };

  return descriptor;
};
