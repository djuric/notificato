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

export interface updateData extends Authentication {
  id: number;
  name?: string;
  description?: string;
  parent?: number;
}

export interface deleteData extends Authentication {
  id: number;
}
