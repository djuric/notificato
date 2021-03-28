export type Category = {
  id: number;
  name: string;
  description: string;
  parent: number;
};

export interface Authentication {
  authToken: string;
}

export interface createData extends Authentication {
  name: string;
  description?: string;
  parent?: number;
}
