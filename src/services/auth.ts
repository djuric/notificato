import User from './user';
import * as UserTypes from '../types/user';

export const Authorize = (role = UserTypes.Role.Subscriber) => (
  _: Object,
  _2: string,
  descriptor: PropertyDescriptor
) => {
  const originalMethod = descriptor.value;

  descriptor.value = async function (...args: any[]) {
    const isAuthenticated = User.verifyToken(args[0].authToken);

    if (!(isAuthenticated instanceof Error)) {
      const isAuthorized = await User.authorize(isAuthenticated.id, role);

      if (isAuthorized === true) {
        return originalMethod.apply(this, args);
      }

      return isAuthorized;
    }

    return isAuthenticated;
  };

  return descriptor;
};
