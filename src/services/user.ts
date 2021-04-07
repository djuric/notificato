import { User as UserEntity } from '../entities/user';
import * as UserTypes from '../types/user';
import { Authorize, generateToken } from './auth';
import { DeleteResult, getManager } from 'typeorm';
import { pick } from 'lodash';
import bcrypt from 'bcrypt';

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

    let existingUser = await getManager().findOne(UserEntity, userData.id);

    if (existingUser === undefined) {
      return new Error('User not found.');
    }

    if (authorizedUser?.role !== UserTypes.Role.Administrator) {
      if (authorizedUser?.id !== userData.id) {
        return new Error('You are not allowed to edit this user.');
      }

      const allowedFields = [
        'firstName',
        'lastName',
        'displayName',
        'categories',
      ];
      userData = pick(userData, [
        'id',
        ...allowedFields,
      ]) as UserTypes.updateData;
    }

    const savedUser = await getManager().save(Object.assign(user, userData));
    const updatedUser = await getManager().findOne(UserEntity, savedUser.id);

    if (!(updatedUser instanceof UserEntity)) {
      return new Error('Could not retrieve updated user.');
    }

    return updatedUser;
  }

  @Authorize()
  delete(
    userData: UserTypes.deleteData,
    authToken: string
  ): Promise<DeleteResult> {
    return getManager().delete(UserEntity, userData.id);
  }

  async register(
    userData: UserTypes.registerData
  ): Promise<Error | UserTypes.sessionData> {
    // TODO: Validation (email not empty, email format, password length, ...)

    let user = await getManager().findOne(UserEntity, {
      email: userData.email,
    });

    if (user instanceof UserEntity) {
      return new Error('User with this email already exists.');
    }

    user = new UserEntity();

    const salt = await bcrypt.genSalt(10);
    const password = await bcrypt.hash(userData.password, salt);

    let createUserData: UserTypes.createData = {
      email: userData.email,
      password,
    };

    const newUser = await getManager().save(
      Object.assign(user, createUserData)
    );

    if (!(newUser instanceof UserEntity)) {
      return new Error('Creating user failed.');
    }

    const token = await generateToken(newUser);

    const userSessionData: UserTypes.sessionData = {
      user: newUser,
      authToken: token,
    };

    return userSessionData;
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
    const token = await generateToken(userObject);

    const userSessionData: UserTypes.sessionData = {
      user: userObject,
      authToken: token,
    };

    return userSessionData;
  }
}

export default new User();
