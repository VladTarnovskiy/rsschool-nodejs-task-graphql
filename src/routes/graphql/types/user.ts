import {
  GraphQLFloat,
  GraphQLInputObjectType,
  GraphQLList,
  GraphQLNonNull,
  GraphQLObjectType,
  GraphQLString,
} from 'graphql';
import { UUIDType } from './uuid.js';

type Loaders = {
  postsByAuthorIdLoader: ReturnType<
    typeof import('../loaders.js').createLoaders
  >['postsByAuthorIdLoader'];
  profilesByUserIdLoader: ReturnType<
    typeof import('../loaders.js').createLoaders
  >['profilesByUserIdLoader'];
  usersSubscribedToLoader: ReturnType<
    typeof import('../loaders.js').createLoaders
  >['usersSubscribedToLoader'];
  subscribedToUserLoader: ReturnType<
    typeof import('../loaders.js').createLoaders
  >['subscribedToUserLoader'];
};

export const UserType = (profileType: GraphQLObjectType, postType: GraphQLObjectType) => {
  const userType = new GraphQLObjectType({
    name: 'User',
    fields: () => ({
      id: {
        type: new GraphQLNonNull(UUIDType),
      },
      name: {
        type: new GraphQLNonNull(GraphQLString),
      },
      balance: {
        type: new GraphQLNonNull(GraphQLFloat),
      },
      profile: {
        type: profileType,
        resolve: async (
          parent: { id: string },
          _: unknown,
          context: { loaders: Loaders },
        ) => {
          return context.loaders.profilesByUserIdLoader.load(parent.id);
        },
      },
      posts: {
        type: new GraphQLNonNull(new GraphQLList(new GraphQLNonNull(postType))),
        resolve: async (
          parent: { id: string },
          _: unknown,
          context: { loaders: Loaders },
        ) => {
          return context.loaders.postsByAuthorIdLoader.load(parent.id);
        },
      },
      userSubscribedTo: {
        type: new GraphQLNonNull(new GraphQLList(new GraphQLNonNull(userType))),
        resolve: async (
          parent: { id: string },
          _: unknown,
          context: { loaders: Loaders },
        ) => {
          return context.loaders.usersSubscribedToLoader.load(parent.id);
        },
      },
      subscribedToUser: {
        type: new GraphQLNonNull(new GraphQLList(new GraphQLNonNull(userType))),
        resolve: async (
          parent: { id: string },
          _: unknown,
          context: { loaders: Loaders },
        ) => {
          return context.loaders.subscribedToUserLoader.load(parent.id);
        },
      },
    }),
  });

  return userType as GraphQLObjectType;
};

export const CreateUserInput = new GraphQLInputObjectType({
  name: 'CreateUserInput',
  fields: () => ({
    name: { type: new GraphQLNonNull(GraphQLString) },
    balance: { type: new GraphQLNonNull(GraphQLFloat) },
  }),
});

export const ChangeUserInput = new GraphQLInputObjectType({
  name: 'ChangeUserInput',
  fields: () => ({
    name: { type: GraphQLString },
    balance: { type: GraphQLFloat },
  }),
});
