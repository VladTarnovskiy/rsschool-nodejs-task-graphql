import {
  GraphQLBoolean,
  GraphQLInputObjectType,
  GraphQLInt,
  GraphQLNonNull,
  GraphQLObjectType,
} from 'graphql';
import { MemberType, MemberTypeIdEnum } from './member.js';
import { UUIDType } from './uuid.js';

type Loaders = {
  memberTypesByIdLoader: ReturnType<
    typeof import('../loaders.js').createLoaders
  >['memberTypesByIdLoader'];
};

export const ProfileType = (memberType: GraphQLObjectType) => {
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
        resolve: async (
          parent: { memberTypeId: string },
          _: unknown,
          context: { loaders: Loaders },
        ) => {
          return context.loaders.memberTypesByIdLoader.load(parent.memberTypeId);
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
