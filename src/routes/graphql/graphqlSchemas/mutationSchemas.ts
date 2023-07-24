import { GraphQLObjectType, GraphQLNonNull, GraphQLBoolean } from 'graphql';
import { UUIDType } from '../types/uuid.js';
import {
  GraphQLContext,
  InputCreatePost,
  InputCreateProfile,
  InputCreateUser,
} from '../types/interfaces.js';
import {
  ChangePostInputType,
  ChangeProfileInputType,
  ChangeUserInputType,
  CreatePostInput,
  CreateProfileInputType,
  CreateUserInputType,
  PostType,
  ProfileType,
  UserType,
} from './garphqlTypes.js';

export const Mutation = new GraphQLObjectType<any, GraphQLContext>({
  name: 'Mutation',
  fields: {
    createPost: {
      type: PostType,
      args: {
        dto: { type: new GraphQLNonNull(CreatePostInput) },
      },
      resolve: async (parent, { dto }: { dto: InputCreatePost }, { fastify }) => {
        return await fastify.prisma.post.create({ data: dto });
      },
    },
    changePost: {
      type: PostType,
      args: {
        id: { type: new GraphQLNonNull(UUIDType) },
        dto: { type: new GraphQLNonNull(ChangePostInputType) },
      },
      resolve: async (
        parent,
        { id, dto }: { id: string; dto: Omit<InputCreatePost, 'authorId'> },
        { fastify },
      ) => {
        return await fastify.prisma.post.update({ where: { id }, data: dto });
      },
    },
    deletePost: {
      type: GraphQLBoolean,
      args: {
        id: { type: new GraphQLNonNull(UUIDType) },
      },
      resolve: async (parent, { id }: { id: string }, { fastify }) => {
        await fastify.prisma.post.delete({ where: { id } });
        return true;
      },
    },
    createUser: {
      type: UserType,
      args: {
        dto: { type: new GraphQLNonNull(CreateUserInputType) },
      },
      resolve: async (parent, { dto }: { dto: InputCreateUser }, { fastify }) => {
        return await fastify.prisma.user.create({ data: dto });
      },
    },
    changeUser: {
      type: UserType,
      args: {
        id: { type: new GraphQLNonNull(UUIDType) },
        dto: { type: new GraphQLNonNull(ChangeUserInputType) },
      },
      resolve: async (
        parent,
        { id, dto }: { id: string; dto: InputCreatePost },
        { fastify },
      ) => {
        return await fastify.prisma.user.update({ where: { id }, data: dto });
      },
    },
    deleteUser: {
      type: GraphQLBoolean,
      args: {
        id: { type: new GraphQLNonNull(UUIDType) },
      },
      resolve: async (parent, { id }: { id: string }, { fastify }) => {
        await fastify.prisma.user.delete({ where: { id } });
        return true;
      },
    },
    createProfile: {
      type: ProfileType,
      args: {
        dto: { type: new GraphQLNonNull(CreateProfileInputType) },
      },
      resolve: async (parent, { dto }: { dto: InputCreateProfile }, { fastify }) => {
        return await fastify.prisma.profile.create({ data: dto });
      },
    },
    changeProfile: {
      type: ProfileType,
      args: {
        id: { type: new GraphQLNonNull(UUIDType) },
        dto: { type: new GraphQLNonNull(ChangeProfileInputType) },
      },
      resolve: async (
        parent,
        { id, dto }: { id: string; dto: Partial<InputCreateProfile> },
        { fastify },
      ) => {
        return await fastify.prisma.profile.update({ where: { id }, data: dto });
      },
    },
    deleteProfile: {
      type: GraphQLBoolean,
      args: {
        id: { type: new GraphQLNonNull(UUIDType) },
      },
      resolve: async (parent, { id }: { id: string }, { fastify }) => {
        await fastify.prisma.profile.delete({ where: { id } });
        return true;
      },
    },
    subscribeTo: {
      type: UserType,
      args: {
        userId: { type: new GraphQLNonNull(UUIDType) },
        authorId: { type: new GraphQLNonNull(UUIDType) },
      },
      resolve: async (
        parent,
        { userId, authorId }: { userId: string; authorId: string },
        { fastify },
      ) => {
        return await fastify.prisma.user.update({
          where: { id: userId },
          data: { userSubscribedTo: { create: { authorId: authorId } } },
        });
      },
    },
    unsubscribeFrom: {
      type: GraphQLBoolean,
      args: {
        userId: { type: new GraphQLNonNull(UUIDType) },
        authorId: { type: new GraphQLNonNull(UUIDType) },
      },
      resolve: async (
        parent,
        { userId, authorId }: { userId: string; authorId: string },
        { fastify },
      ) => {
        await fastify.prisma.subscribersOnAuthors.delete({
          where: {
            subscriberId_authorId: {
              subscriberId: userId,
              authorId,
            },
          },
        });
        return true;
      },
    },
  },
});
