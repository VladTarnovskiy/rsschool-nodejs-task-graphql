import DataLoader from 'dataloader';
import { FastifyInstance } from 'fastify';

export interface InputCreatePost {
  title: string;
  content: string;
  authorId: string;
}

export interface InputCreateUser {
  name: string;
  balance: number;
}

export interface InputCreateProfile {
  userId: string;
  isMale: boolean;
  yearOfBirth: number;
  memberTypeId: string;
}

export interface User {
  id: string;
  name: string;
  balance: number;
}

export interface GraphQLContext {
  fastify: FastifyInstance;
  dataLoaders: {
    profileLoader: DataLoader<string, unknown>;
    userPostsLoader: DataLoader<string, unknown>;
    userRelationsLoader: DataLoader<
      string,
      { subscribedTo: User[]; subscribedBy: User[] }
    >;
    memberTypeLoader: DataLoader<string, unknown>;
  };
}
