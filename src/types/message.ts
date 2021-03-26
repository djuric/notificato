import * as UserType from './user';

export type Message = {
  id: number;
  title: string;
  subtitle: string;
  description: string;
  user: UserType.User;
};

export interface Authentication {
  authToken: string;
}

export interface createData extends Authentication {
  title: string;
  subtitle?: string;
  description?: string;
  user: UserType.User;
}

export interface updateData extends Authentication {
  id: number;
  title?: string;
  subtitle?: string;
  description?: string;
}

export interface deleteData extends Authentication {
  id: number;
}
