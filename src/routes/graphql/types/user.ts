import {
  GraphQLFloat,
  GraphQLInputObjectType,
  GraphQLList,
  GraphQLNonNull,
  GraphQLObjectType,
  GraphQLString,
} from 'graphql';
import { UUIDType } from './uuid.js';
import { PrismaClient } from '@prisma/client';

export const UserType = (
  prisma: PrismaClient,
  profileType: GraphQLObjectType,
  postType: GraphQLObjectType,
) => {
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
        resolve: async (parent: { id: string }) => {
          return prisma.profile.findUnique({
            where: { userId: parent.id },
          });
        },
      },
      posts: {
        type: new GraphQLNonNull(new GraphQLList(new GraphQLNonNull(postType))),
        resolve: async (parent: { id: string }) => {
          return prisma.post.findMany({
            where: { authorId: parent.id },
          });
        },
      },
      userSubscribedTo: {
        type: new GraphQLNonNull(new GraphQLList(new GraphQLNonNull(userType))),
        resolve: async (parent: { id: string }) => {
          return prisma.user.findMany({
            where: {
              subscribedToUser: {
                some: {
                  subscriberId: parent.id,
                },
              },
            },
          });
        },
      },
      subscribedToUser: {
        type: new GraphQLNonNull(new GraphQLList(new GraphQLNonNull(userType))),
        resolve: async (parent: { id: string }) => {
          return prisma.user.findMany({
            where: {
              userSubscribedTo: {
                some: {
                  authorId: parent.id,
                },
              },
            },
          });
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
