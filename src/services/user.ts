import { User as UserEntity } from '../entities/user';
import * as UserTypes from '../types/user';
import { Authorize } from './auth';
import { DeleteResult, getManager } from 'typeorm';
import { pick } from 'lodash';
import config from 'config';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

class User {
  @Authorize()
  async create(
    userData: UserTypes.createData,
    authToken: string
  ): Promise<Error | UserEntity> {
    let user = await getManager().findOne(UserEntity, {
      email: userData.email,
    });

    if (user !== undefined) {
      return new Error('User with this email already exists.');
    }

    user = new UserEntity();
    // TODO: Validation (email not empty, email format, password length, ...)

    const salt = await bcrypt.genSalt(10);
    userData.password = await bcrypt.hash(userData.password, salt);

    return getManager().save(Object.assign(user, userData));
  }

  @Authorize(UserTypes.Role.Subscriber)
  async update(
    userData: UserTypes.updateData,
    authToken: string,
    authorizedUser?: UserTypes.User
  ): Promise<Error | UserEntity> {
    const user = new UserEntity();

    if (authorizedUser?.role !== UserTypes.Role.Administrator) {
      if (authorizedUser?.id !== userData.id) {
        return new Error('You are not allowed to edit this user.');
      }

      const allowedFields = ['firstName', 'lastName', 'displayName'];
      userData = pick(userData, [
        'id',
        ...allowedFields,
      ]) as UserTypes.updateData;
    }

    return getManager().save(Object.assign(user, userData));
  }

  @Authorize()
  delete(
    userData: UserTypes.deleteData,
    authToken: string
  ): Promise<DeleteResult> {
    return getManager().delete(UserEntity, userData.id);
  }

  async login(
    userData: UserTypes.loginData
  ): Promise<Error | UserTypes.sessionData> {
    const user = await getManager().findOne(UserEntity, {
      email: userData.email,
    });

    if (user === undefined) {
      return new Error("User with this email doesn't exist.");
    }

    const isValidPassword = await bcrypt.compare(
      userData.password,
      user.password
    );

    if (!isValidPassword) {
      return new Error('Invalid password.');
    }

    const userObject = user as UserTypes.User;
    const token = await this.generateToken(userObject);

    const userSessionData: UserTypes.sessionData = {
      user: userObject,
      authToken: token,
    };

    return userSessionData;
  }

  private async generateToken(userData: UserTypes.User): Promise<string> {
    const tokenData: UserTypes.tokenData = {
      id: userData.id,
      email: userData.email,
    };

    return jwt.sign(tokenData, config.get('jwtPrivateKey'), {
      expiresIn: '2 days',
    });
  }

  verifyToken(token: string): Error | UserTypes.tokenData {
    try {
      const decoded = jwt.verify(token, config.get('jwtPrivateKey'));
      return decoded as UserTypes.tokenData;
    } catch {
      return new Error('Invalid token.');
    }
  }

  async authorize(
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
}

export default new User();
