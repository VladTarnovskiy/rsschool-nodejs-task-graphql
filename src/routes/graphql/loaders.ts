import DataLoader from 'dataloader';
import { PrismaClient } from '@prisma/client';

export const createLoaders = (prisma: PrismaClient) => {
  const postsByAuthorIdLoader = new DataLoader<
    string,
    Array<{ id: string; title: string; content: string; authorId: string }>
  >(async (authorIds: readonly string[]) => {
    const posts = await prisma.post.findMany({
      where: {
        authorId: {
          in: [...authorIds],
        },
      },
    });
    const postsByAuthorId = new Map<string, typeof posts>();
    for (const authorId of authorIds) {
      postsByAuthorId.set(authorId, []);
    }
    for (const post of posts) {
      const authorPosts = postsByAuthorId.get(post.authorId) || [];
      authorPosts.push(post);
    }
    return authorIds.map((authorId) => postsByAuthorId.get(authorId) || []);
  });

  const profilesByUserIdLoader = new DataLoader<
    string,
    {
      id: string;
      isMale: boolean;
      yearOfBirth: number;
      userId: string;
      memberTypeId: string;
    } | null
  >(async (userIds: readonly string[]) => {
    const profiles = await prisma.profile.findMany({
      where: {
        userId: {
          in: [...userIds],
        },
      },
    });
    const profileMap = new Map(profiles.map((profile) => [profile.userId, profile]));
    return userIds.map((userId) => profileMap.get(userId) || null);
  });

  const memberTypesByIdLoader = new DataLoader<
    string,
    { id: string; discount: number; postsLimitPerMonth: number } | null
  >(async (ids: readonly string[]) => {
    const memberTypes = await prisma.memberType.findMany({
      where: {
        id: {
          in: [...ids],
        },
      },
    });
    const memberTypeMap = new Map(memberTypes.map((mt) => [mt.id, mt]));
    return ids.map((id) => memberTypeMap.get(id) || null);
  });

  const usersSubscribedToLoader = new DataLoader<
    string,
    Array<{ id: string; name: string; balance: number }>
  >(async (subscriberIds: readonly string[]) => {
    const subscriptions = await prisma.subscribersOnAuthors.findMany({
      where: {
        subscriberId: {
          in: [...subscriberIds],
        },
      },
      include: {
        author: true,
      },
    });
    const result = new Map<
      string,
      Array<{ id: string; name: string; balance: number }>
    >();
    for (const subscriberId of subscriberIds) {
      result.set(subscriberId, []);
    }
    for (const sub of subscriptions) {
      const arr = result.get(sub.subscriberId) || [];
      arr.push(sub.author);
    }
    return subscriberIds.map((subscriberId) => result.get(subscriberId) || []);
  });

  const subscribedToUserLoader = new DataLoader<
    string,
    Array<{ id: string; name: string; balance: number }>
  >(async (authorIds: readonly string[]) => {
    const subscriptions = await prisma.subscribersOnAuthors.findMany({
      where: {
        authorId: {
          in: [...authorIds],
        },
      },
      include: {
        subscriber: true,
      },
    });
    const result = new Map<
      string,
      Array<{ id: string; name: string; balance: number }>
    >();
    for (const authorId of authorIds) {
      result.set(authorId, []);
    }
    for (const sub of subscriptions) {
      const arr = result.get(sub.authorId) || [];
      arr.push(sub.subscriber);
    }
    return authorIds.map((authorId) => result.get(authorId) || []);
  });

  return {
    postsByAuthorIdLoader,
    profilesByUserIdLoader,
    memberTypesByIdLoader,
    usersSubscribedToLoader,
    subscribedToUserLoader,
  };
};
