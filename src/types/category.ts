export type Category = {
  id: number;
  name: string;
  description?: string;
  parent?: Category;
};

export interface createData {
  name: string;
  description?: string;
  parent?: Category;
}

export interface updateData {
  id: number;
  name?: string;
  description?: string;
  parent?: Category;
}

export interface deleteData {
  id: number;
}
