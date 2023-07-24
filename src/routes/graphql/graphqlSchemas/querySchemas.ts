import { GraphQLObjectType, GraphQLList, GraphQLNonNull } from 'graphql';
import { UUIDType } from '../types/uuid.js';
import { GraphQLContext } from '../types/interfaces.js';
import {
  MemberType,
  MemberTypeId,
  PostType,
  ProfileType,
  UserType,
} from './garphqlTypes.js';

export const Query = new GraphQLObjectType({
  name: 'Query',
  fields: {
    memberTypes: {
      type: new GraphQLList(MemberType),
      resolve: async (_, __, { fastify }: GraphQLContext) =>
        fastify.prisma.memberType.findMany(),
    },
    memberType: {
      type: MemberType,
      args: { id: { type: MemberTypeId } },
      resolve: async (_, { id }: { id: string }, { fastify }: GraphQLContext) => {
        const memberType = await fastify.prisma.memberType.findUnique({
          where: {
            id,
          },
        });
        return memberType;
      },
    },
    posts: {
      type: new GraphQLList(PostType),
      resolve: async (_, __, { fastify }: GraphQLContext) =>
        fastify.prisma.post.findMany(),
    },
    post: {
      type: PostType,
      args: { id: { type: new GraphQLNonNull(UUIDType) } },
      resolve: async (_, { id }: { id: string }, { fastify }: GraphQLContext) => {
        const post = await fastify.prisma.post.findUnique({
          where: {
            id,
          },
        });
        return post;
      },
    },
    users: {
      type: new GraphQLList(UserType),
      resolve: async (_, __, { fastify }: GraphQLContext) =>
        fastify.prisma.user.findMany(),
    },
    user: {
      type: UserType,
      args: { id: { type: new GraphQLNonNull(UUIDType) } },
      resolve: async (_, { id }: { id: string }, { fastify }: GraphQLContext) => {
        const user = await fastify.prisma.user.findUnique({
          where: {
            id,
          },
        });
        return user;
      },
    },
    profiles: {
      type: new GraphQLList(ProfileType),
      resolve: async (_, __, { fastify }: GraphQLContext) =>
        fastify.prisma.profile.findMany(),
    },
    profile: {
      type: ProfileType,
      args: { id: { type: new GraphQLNonNull(UUIDType) } },
      resolve: async (_, { id }: { id: string }, { fastify }: GraphQLContext) => {
        const profile = await fastify.prisma.profile.findUnique({
          where: {
            id,
          },
        });
        return profile;
      },
    },
  },
});
