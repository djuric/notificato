import { readFileSync } from 'fs';
import path from 'path';
import { ApolloServer } from 'apollo-server';
import Category from '../services/category';
import User from '../services/user';

const resolvers = {
  Role: {
    Subscriber: 1,
    Administrator: 5,
  },
  Query: {
    user: async (_: any, { id }: any, { token }: any) => {
      return await User.get(id, token);
    },
    category: async (_: any, { id }: any, { token }: any) => {
      return await Category.get(id, token);
    },
  },
  Mutation: {
    loginUser: async (_: any, { input }: any) => {
      return await User.login(input);
    },
    registerUser: async (_: any, { input }: any) => {
      return await User.register(input);
    },
    createUser: async (_: any, { input }: any, { token }: any) => {
      return await User.create(input, token);
    },
    updateUser: async (_: any, { input }: any, { token }: any) => {
      return User.update(input, token);
    },
    deleteUser: async (_: any, { input }: any, { token }: any) => {
      const deleteResult = await User.delete(input, token);
      return Boolean(deleteResult.affected);
    },
  },
};

const server = new ApolloServer({
  typeDefs: readFileSync(path.join(__dirname, 'schema.graphql')).toString(),
  resolvers,
  context: ({ req }) => {
    let token = req.headers.authorization || '';
    token = token.replace('Bearer ', '');
    return { token };
  },
});

export default async function apiServer(port: number = 4000) {
  const apiServer = await server.listen({
    port,
  });
  console.log(`Server ready at ${apiServer.url}`);
}
