import { GraphQLObjectType, GraphQLNonNull, GraphQLList } from 'graphql';
import { MemberTypeIdEnum } from './member.js';
import { UUIDType } from './uuid.js';
import { PrismaClient } from '@prisma/client';

export const RootQueryType = (
  prisma: PrismaClient,
  userType: GraphQLObjectType,
  profileType: GraphQLObjectType,
  postType: GraphQLObjectType,
  memberType: GraphQLObjectType,
) => {
  return new GraphQLObjectType({
    name: 'RootQueryType',
    fields: () => ({
      memberTypes: {
        type: new GraphQLNonNull(new GraphQLList(new GraphQLNonNull(memberType))),
        resolve: async () => {
          return await prisma.memberType.findMany();
        },
      },
      memberType: {
        type: memberType,
        args: {
          id: { type: new GraphQLNonNull(MemberTypeIdEnum) },
        },
        resolve: async (_: unknown, args: { id: string }) => {
          return await prisma.memberType.findUnique({
            where: { id: args.id },
          });
        },
      },
      users: {
        type: new GraphQLNonNull(new GraphQLList(new GraphQLNonNull(userType))),
        resolve: async () => {
          return await prisma.user.findMany();
        },
      },
      user: {
        type: userType,
        args: {
          id: { type: new GraphQLNonNull(UUIDType) },
        },
        resolve: async (_: unknown, args: { id: string }) => {
          return await prisma.user.findUnique({
            where: { id: args.id },
          });
        },
      },
      posts: {
        type: new GraphQLNonNull(new GraphQLList(new GraphQLNonNull(postType))),
        resolve: async () => {
          return await prisma.post.findMany();
        },
      },
      post: {
        type: postType,
        args: {
          id: { type: new GraphQLNonNull(UUIDType) },
        },
        resolve: async (_: unknown, args: { id: string }) => {
          return await prisma.post.findUnique({
            where: { id: args.id },
          });
        },
      },
      profiles: {
        type: new GraphQLNonNull(new GraphQLList(new GraphQLNonNull(profileType))),
        resolve: async () => {
          return await prisma.profile.findMany();
        },
      },
      profile: {
        type: profileType,
        args: {
          id: { type: new GraphQLNonNull(UUIDType) },
        },
        resolve: async (_: unknown, args: { id: string }) => {
          return await prisma.profile.findUnique({
            where: { id: args.id },
          });
        },
      },
    }),
  });
};
