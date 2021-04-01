import * as UserType from './user';

export type Message = {
  id: number;
  title: string;
  subtitle: string;
  description: string;
  user: UserType.User;
};

export interface createData {
  title: string;
  subtitle?: string;
  description?: string;
  user: UserType.User;
}

export interface updateData {
  id: number;
  title?: string;
  subtitle?: string;
  description?: string;
}

export interface deleteData {
  id: number;
}
