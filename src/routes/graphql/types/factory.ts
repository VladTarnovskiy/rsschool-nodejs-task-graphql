import { PrismaClient } from '@prisma/client';
import { UserType } from './user.js';
import { ProfileType } from './profile.js';
import { PostType } from './post.js';
import { MemberType } from './member.js';
import { RootQueryType } from './root.js';

export const createRootType = (prisma: PrismaClient) => {
  // Create types in dependency order
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

  return rootQueryType;
};
