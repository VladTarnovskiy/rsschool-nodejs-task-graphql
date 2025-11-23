import { PrismaClient } from '@prisma/client';
import { UserType } from './types/user.js';
import { ProfileType } from './types/profile.js';
import { PostType } from './types/post.js';
import { MemberType } from './types/member.js';
import { RootQueryType } from './types/root.js';
import { Mutations } from './mutation/mutation.js';

export const createSchema = (prisma: PrismaClient) => {
  const memberType = MemberType;
  const postType = PostType;
  const profileType = ProfileType(prisma, memberType);
  const userType = UserType(prisma, profileType, postType);

  const rootQueryType = RootQueryType(
    prisma,
    userType,
    profileType,
    postType,
    memberType,
  );
  const mutations = Mutations(prisma, userType, profileType, postType);

  return { rootQueryType, mutations };
};
