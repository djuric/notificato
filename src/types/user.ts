import * as CategoryType from './category';

export type User = {
  id: number;
  email: string;
  firstName?: string;
  lastName?: string;
  displayName?: string;
  role: Role;
  categories: CategoryType.Category[];
};

export enum Role {
  Subscriber = 1,
  Administrator = 5,
}

export interface Authentication {
  authToken: string;
}

export interface createData extends Authentication {
  email: string;
  password: string;
  firstName?: string;
  lastName?: string;
  displayName?: string;
  role?: Role;
  categories?: CategoryType.Category[];
}

export interface updateData extends Authentication {
  id: number;
  email?: string;
  firstName?: string;
  lastName?: string;
  displayName?: string;
  categories?: CategoryType.Category[];
}

export interface deleteData extends Authentication {
  id: number;
}

export type loginData = {
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
