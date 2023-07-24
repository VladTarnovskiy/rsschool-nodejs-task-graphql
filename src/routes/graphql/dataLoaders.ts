import { FastifyInstance } from 'fastify';

export const loaderProfiles = async (userIds: string[], fastify: FastifyInstance) => {
  const profiles = await fastify.prisma.profile.findMany({
    where: { userId: { in: userIds } },
    include: { memberType: true },
  });
  const profileMap = new Map(profiles.map((profile) => [profile.userId, profile]));
  return userIds.map((userId) => profileMap.get(userId));
};

export const loaderMemberTypes = async (
  memberTypeIds: string[],
  fastify: FastifyInstance,
) => {
  const memberTypes = await fastify.prisma.memberType.findMany({
    where: { id: { in: memberTypeIds } },
  });
  const memberTypeMap = new Map(
    memberTypes.map((memberType) => [memberType.id, memberType]),
  );
  return memberTypeIds.map((memberTypeId) => memberTypeMap.get(memberTypeId));
};

export const loaderUserPosts = async (userIds: string[], fastify: FastifyInstance) => {
  const posts = await fastify.prisma.post.findMany({
    where: { authorId: { in: userIds } },
  });
  const postsByAuthor = userIds.map((userId) =>
    posts.filter((post) => post.authorId === userId),
  );
  return postsByAuthor;
};

export const loaderUserRelations = async (
  userIds: string[],
  fastify: FastifyInstance,
) => {
  const subscriptionsOnAuthor = await fastify.prisma.subscribersOnAuthors.findMany({
    where: { subscriberId: { in: userIds } },
    include: { author: true },
  });

  const subscribers = await fastify.prisma.subscribersOnAuthors.findMany({
    where: { authorId: { in: userIds } },
    include: { subscriber: true },
  });

  return userIds.map((userId) => ({
    subscribedTo: subscriptionsOnAuthor
      .filter((sub) => sub.subscriberId === userId)
      .map((sub) => sub.author),
    subscribedBy: subscribers
      .filter((sub) => sub.authorId === userId)
      .map((sub) => sub.subscriber),
  }));
};
