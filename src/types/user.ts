import * as CategoryType from './category';

export type User = {
  id: number;
  email: string;
  firstName?: string;
  lastName?: string;
  displayName?: string;
  role: Role;
  categories?: CategoryType.Category[];
};

export enum Role {
  Subscriber = 1,
  Administrator = 5,
}

export interface createData {
  email: string;
  password: string;
  firstName?: string;
  lastName?: string;
  displayName?: string;
  role?: Role;
  categories?: CategoryType.Category[];
}

export interface updateData {
  id: number;
  email?: string;
  firstName?: string;
  lastName?: string;
  displayName?: string;
  categories?: CategoryType.Category[];
}

export interface deleteData {
  id: number;
}

export type loginData = {
  email: string;
  password: string;
};

export type registerData = {
  email: string;
  password: string;
};

export type sessionData = {
  user: User;
  authToken: string;
};

export type tokenData = {
  id: number;
  email: string;
  iat?: number;
  exp?: number;
};
