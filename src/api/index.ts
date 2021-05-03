import { readFileSync } from 'fs';
import path from 'path';
import { ApolloServer } from 'apollo-server';
import Category from '../services/category';
import User from '../services/user';
import { verifyToken } from '../services/auth';
import config from 'config';

const resolvers = {
  Role: {
    Subscriber: 1,
    Administrator: 5,
  },
  Query: {
    user: async (_: any, { id }: any, { tokenData }: any) => {
      if (tokenData instanceof Error) {
        return tokenData;
      }
      return await User.get(id, tokenData);
    },
    users: async (_: any, _2: any, { tokenData }: any) => {
      if (tokenData instanceof Error) {
        return tokenData;
      }
      return await User.getAll(tokenData);
    },
    category: async (_: any, { id }: any) => {
      return await Category.get(id);
    },
    categories: async () => {
      return await Category.getAll();
    },
  },
  Mutation: {
    loginUser: async (_: any, { input }: any) => {
      return await User.login(input);
    },
    registerUser: async (_: any, { input }: any) => {
      return await User.register(input);
    },
    createUser: async (_: any, { input }: any, { tokenData }: any) => {
      if (tokenData instanceof Error) {
        return tokenData;
      }
      return await User.create(input, tokenData);
    },
    updateUser: async (_: any, { input }: any, { tokenData }: any) => {
      if (tokenData instanceof Error) {
        return tokenData;
      }
      return User.update(input, tokenData);
    },
    deleteUser: async (_: any, { input }: any, { tokenData }: any) => {
      if (tokenData instanceof Error) {
        return tokenData;
      }
      const deleteResult = await User.delete(input, tokenData);

      if (deleteResult instanceof Error) {
        return deleteResult;
      }
      return Boolean(deleteResult.affected);
    },
    createCategory: async (_: any, { input }: any, { tokenData }: any) => {
      if (tokenData instanceof Error) {
        return tokenData;
      }
      return Category.create(input, tokenData);
    },
    updateCategory: async (_: any, { input }: any, { tokenData }: any) => {
      if (tokenData instanceof Error) {
        return tokenData;
      }
      return Category.update(input, tokenData);
    },
    deleteCategory: async (_: any, { input }: any, { tokenData }: any) => {
      if (tokenData instanceof Error) {
        return tokenData;
      }
      const deleteResult = await Category.delete(input, tokenData);

      if (deleteResult instanceof Error) {
        return deleteResult;
      }
      return Boolean(deleteResult.affected);
    },
  },
};

const server = new ApolloServer({
  typeDefs: readFileSync(path.join(__dirname, 'schema.graphql')).toString(),
  resolvers,
  context: async ({ req }) => {
    let token = req.headers.authorization || '';
    token = token.replace('Bearer ', '');

    const tokenData = verifyToken(token);
    return { tokenData };
  },
});

export default async function apiServer() {
  const apiServer = await server.listen({
    port: config.get('port'),
  });
  console.log(`Server ready at ${apiServer.url}`);
}
