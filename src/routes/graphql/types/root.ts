import { GraphQLObjectType, GraphQLNonNull, GraphQLList, GraphQLError } from 'graphql';
import { MemberType, MemberTypeIdEnum } from './member.js';
import { UUIDType } from './uuid.js';
import { PrismaClient } from '@prisma/client';
import { PostType } from './post.js';
import { ProfileType } from './profile.js';
import { UserType } from './user.js';

export const RootQueryType = (prisma: PrismaClient) => {
  return new GraphQLObjectType({
    name: 'RootQueryType',
    fields: () => ({
      memberTypes: {
        type: new GraphQLNonNull(new GraphQLList(new GraphQLNonNull(MemberType))),
        resolve: async () => {
          return prisma.memberType.findMany();
        },
      },
      memberType: {
        type: MemberType,
        args: {
          id: { type: new GraphQLNonNull(MemberTypeIdEnum) },
        },
        resolve: async (_: unknown, args: { id: string }) => {
          const memberType = await prisma.memberType.findUnique({
            where: { id: args.id },
          });
          if (memberType === null) {
            throw new GraphQLError('MemberType not found', {
              extensions: { code: 'NOT_FOUND' },
            });
          }
          return memberType;
        },
      },
      users: {
        type: new GraphQLNonNull(new GraphQLList(new GraphQLNonNull(UserType))),
        resolve: async () => {
          return prisma.user.findMany();
        },
      },
      user: {
        type: UserType as GraphQLObjectType,
        args: {
          id: { type: new GraphQLNonNull(UUIDType) },
        },
        resolve: async (_: unknown, args: { id: string }) => {
          const user = await prisma.user.findUnique({
            where: { id: args.id },
          });
          if (user === null) {
            throw new GraphQLError('User not found', {
              extensions: { code: 'NOT_FOUND' },
            });
          }
          return user;
        },
      },
      posts: {
        type: new GraphQLNonNull(new GraphQLList(new GraphQLNonNull(PostType))),
        resolve: async () => {
          return prisma.post.findMany();
        },
      },
      post: {
        type: PostType,
        args: {
          id: { type: new GraphQLNonNull(UUIDType) },
        },
        resolve: async (_: unknown, args: { id: string }) => {
          const post = await prisma.post.findUnique({
            where: { id: args.id },
          });
          if (post === null) {
            throw new GraphQLError('Post not found', {
              extensions: { code: 'NOT_FOUND' },
            });
          }
          return post;
        },
      },
      profiles: {
        type: new GraphQLNonNull(new GraphQLList(new GraphQLNonNull(ProfileType))),
        resolve: async () => {
          return prisma.profile.findMany();
        },
      },
      profile: {
        type: ProfileType,
        args: {
          id: { type: new GraphQLNonNull(UUIDType) },
        },
        resolve: async (_: unknown, args: { id: string }) => {
          const profile = await prisma.profile.findUnique({
            where: { id: args.id },
          });
          if (profile === null) {
            throw new GraphQLError('Profile not found', {
              extensions: { code: 'NOT_FOUND' },
            });
          }
          return profile;
        },
      },
    }),
  });
};
