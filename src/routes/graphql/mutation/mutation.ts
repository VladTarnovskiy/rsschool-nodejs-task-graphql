import { PrismaClient } from '@prisma/client';
import { GraphQLObjectType, GraphQLNonNull, GraphQLString } from 'graphql';
import { CreatePostInput, ChangePostInput } from '../types/post.js';
import { CreateProfileInput, ChangeProfileInput } from '../types/profile.js';
import { CreateUserInput, ChangeUserInput } from '../types/user.js';
import { UUIDType } from '../types/uuid.js';

export const Mutations = (
  prisma: PrismaClient,
  userType: GraphQLObjectType,
  profileType: GraphQLObjectType,
  postType: GraphQLObjectType,
) => {
  return new GraphQLObjectType({
    name: 'Mutations',
    fields: () => ({
      createUser: {
        type: new GraphQLNonNull(userType),
        args: {
          dto: { type: new GraphQLNonNull(CreateUserInput) },
        },
        resolve: async (_: unknown, args: { dto: { name: string; balance: number } }) => {
          return prisma.user.create({
            data: args.dto,
          });
        },
      },
      createProfile: {
        type: new GraphQLNonNull(profileType),
        args: {
          dto: { type: new GraphQLNonNull(CreateProfileInput) },
        },
        resolve: async (
          _: unknown,
          args: {
            dto: {
              isMale: boolean;
              yearOfBirth: number;
              userId: string;
              memberTypeId: string;
            };
          },
        ) => {
          return prisma.profile.create({
            data: args.dto,
          });
        },
      },
      createPost: {
        type: new GraphQLNonNull(postType),
        args: {
          dto: { type: new GraphQLNonNull(CreatePostInput) },
        },
        resolve: async (
          _: unknown,
          args: {
            dto: {
              title: string;
              content: string;
              authorId: string;
            };
          },
        ) => {
          return prisma.post.create({
            data: args.dto,
          });
        },
      },
      changePost: {
        type: new GraphQLNonNull(postType),
        args: {
          id: { type: new GraphQLNonNull(UUIDType) },
          dto: { type: new GraphQLNonNull(ChangePostInput) },
        },
        resolve: async (
          _: unknown,
          args: {
            id: string;
            dto: {
              title?: string;
              content?: string;
            };
          },
        ) => {
          return prisma.post.update({
            where: { id: args.id },
            data: args.dto,
          });
        },
      },
      changeProfile: {
        type: new GraphQLNonNull(profileType),
        args: {
          id: { type: new GraphQLNonNull(UUIDType) },
          dto: { type: new GraphQLNonNull(ChangeProfileInput) },
        },
        resolve: async (
          _: unknown,
          args: {
            id: string;
            dto: {
              isMale?: boolean;
              yearOfBirth?: number;
              memberTypeId?: string;
            };
          },
        ) => {
          return prisma.profile.update({
            where: { id: args.id },
            data: args.dto,
          });
        },
      },
      changeUser: {
        type: new GraphQLNonNull(userType),
        args: {
          id: { type: new GraphQLNonNull(UUIDType) },
          dto: { type: new GraphQLNonNull(ChangeUserInput) },
        },
        resolve: async (
          _: unknown,
          args: {
            id: string;
            dto: {
              name?: string;
              balance?: number;
            };
          },
        ) => {
          return prisma.user.update({
            where: { id: args.id },
            data: args.dto,
          });
        },
      },
      deleteUser: {
        type: new GraphQLNonNull(GraphQLString),
        args: {
          id: { type: new GraphQLNonNull(UUIDType) },
        },
        resolve: async (_: unknown, args: { id: string }) => {
          await prisma.user.delete({
            where: { id: args.id },
          });
          return 'User deleted';
        },
      },
      deletePost: {
        type: new GraphQLNonNull(GraphQLString),
        args: {
          id: { type: new GraphQLNonNull(UUIDType) },
        },
        resolve: async (_: unknown, args: { id: string }) => {
          await prisma.post.delete({
            where: { id: args.id },
          });
          return 'Post deleted';
        },
      },
      deleteProfile: {
        type: new GraphQLNonNull(GraphQLString),
        args: {
          id: { type: new GraphQLNonNull(UUIDType) },
        },
        resolve: async (_: unknown, args: { id: string }) => {
          await prisma.profile.delete({
            where: { id: args.id },
          });
          return 'Profile deleted';
        },
      },
      subscribeTo: {
        type: new GraphQLNonNull(GraphQLString),
        args: {
          userId: { type: new GraphQLNonNull(UUIDType) },
          authorId: { type: new GraphQLNonNull(UUIDType) },
        },
        resolve: async (_: unknown, args: { userId: string; authorId: string }) => {
          await prisma.subscribersOnAuthors.create({
            data: {
              subscriberId: args.userId,
              authorId: args.authorId,
            },
          });
          return 'Subscribed';
        },
      },
      unsubscribeFrom: {
        type: new GraphQLNonNull(GraphQLString),
        args: {
          userId: { type: new GraphQLNonNull(UUIDType) },
          authorId: { type: new GraphQLNonNull(UUIDType) },
        },
        resolve: async (_: unknown, args: { userId: string; authorId: string }) => {
          await prisma.subscribersOnAuthors.delete({
            where: {
              subscriberId_authorId: {
                subscriberId: args.userId,
                authorId: args.authorId,
              },
            },
          });
          return 'Unsubscribed';
        },
      },
    }),
  });
};
