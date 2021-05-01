import { User as UserEntity } from '../entities/user';
import * as UserTypes from '../types/user';
import { Category as CategoryEntity } from '../entities/category';
import { generateToken } from './auth';
import { DeleteResult, getManager } from 'typeorm';
import { pick } from 'lodash';
import bcrypt from 'bcrypt';

class User {
  async get(id: number, userTokenData: UserTypes.tokenData) {
    if (userTokenData.role !== UserTypes.Role.Administrator) {
      if (userTokenData.id !== id) {
        return new Error(`You are not allowed to view this user.`);
      }
    }

    const user = await getManager().findOne(UserEntity, id);

    if (user === undefined) {
      return new Error(`This user doesn't exist.`);
    }

    return user;
  }

  async getAll(userTokenData: UserTypes.tokenData) {
    if (userTokenData.role !== UserTypes.Role.Administrator) {
      return new Error(`You don't have permission to list all users.`);
    }

    return getManager().find(UserEntity);
  }

  async create(
    userData: UserTypes.createData,
    userTokenData: UserTypes.tokenData
  ): Promise<Error | UserEntity> {
    if (userTokenData.role !== UserTypes.Role.Administrator) {
      return new Error(`You don't have permission to create new user.`);
    }

    let user = await getManager().findOne(UserEntity, {
      email: userData.email,
    });

    if (user !== undefined) {
      return new Error(`User with this email already exists.`);
    }

    user = new UserEntity();
    // TODO: Validation (email not empty, email format, password length, ...)

    const salt = await bcrypt.genSalt(10);
    userData.password = await bcrypt.hash(userData.password, salt);

    if (userData.categories) {
      user.categories = userData.categories.map((id) => {
        return { id } as CategoryEntity;
      });
      delete userData.categories;
    }

    return getManager().save(Object.assign(user, userData));
  }

  async update(
    userData: UserTypes.updateData,
    userTokenData: UserTypes.tokenData
  ): Promise<Error | UserEntity> {
    const user = new UserEntity();
    const existingUser = await getManager().findOne(UserEntity, userData.id);

    if (existingUser === undefined) {
      return new Error(`User not found.`);
    }

    if (userTokenData.role !== UserTypes.Role.Administrator) {
      if (userTokenData.id !== userData.id) {
        return new Error(`You are not allowed to edit this user.`);
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

    if (userData.categories) {
      user.categories = userData.categories.map((id) => {
        return { id } as CategoryEntity;
      });
      delete userData.categories;
    }

    const savedUser = await getManager().save(Object.assign(user, userData));
    const updatedUser = await getManager().findOne(UserEntity, savedUser.id);

    if (!(updatedUser instanceof UserEntity)) {
      return new Error(`Could not retrieve updated user.`);
    }

    return updatedUser;
  }

  async delete(
    userData: UserTypes.deleteData,
    userTokenData: UserTypes.tokenData
  ): Promise<Error | DeleteResult> {
    if (userTokenData.role !== UserTypes.Role.Administrator) {
      return new Error(`You don't have permission to delete this user.`);
    }

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
