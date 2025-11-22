import {
  GraphQLBoolean,
  GraphQLInputObjectType,
  GraphQLInt,
  GraphQLNonNull,
  GraphQLObjectType,
} from 'graphql';
import { MemberType, MemberTypeIdEnum } from './member.js';
import { UUIDType } from './uuid.js';
import { PrismaClient } from '@prisma/client';

export const ProfileType = (prisma: PrismaClient, memberType: GraphQLObjectType) => {
  return new GraphQLObjectType({
    name: 'Profile',
    fields: () => ({
      id: {
        type: new GraphQLNonNull(UUIDType),
      },
      isMale: {
        type: new GraphQLNonNull(GraphQLBoolean),
      },
      yearOfBirth: {
        type: new GraphQLNonNull(GraphQLInt),
      },
      memberType: {
        type: new GraphQLNonNull(memberType),
        resolve: async (parent: { memberTypeId: string }) => {
          return prisma.memberType.findUnique({
            where: { id: parent.memberTypeId },
          });
        },
      },
    }),
  });
};

//input

export const CreateProfileInput = new GraphQLInputObjectType({
  name: 'CreateProfileInput',
  fields: () => ({
    isMale: { type: new GraphQLNonNull(GraphQLBoolean) },
    yearOfBirth: { type: new GraphQLNonNull(GraphQLInt) },
    userId: { type: new GraphQLNonNull(UUIDType) },
    memberTypeId: { type: new GraphQLNonNull(MemberTypeIdEnum) },
  }),
});

export const ChangeProfileInput = new GraphQLInputObjectType({
  name: 'ChangeProfileInput',
  fields: () => ({
    isMale: { type: GraphQLBoolean },
    yearOfBirth: { type: GraphQLInt },
    memberTypeId: { type: MemberTypeIdEnum },
  }),
});
