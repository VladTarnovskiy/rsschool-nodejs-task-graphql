import { Type } from '@fastify/type-provider-typebox';
import { Query } from './graphqlSchemas/querySchemas.js';
import { Mutation } from './graphqlSchemas/mutationSchemas.js';
import { GraphQLSchema } from 'graphql';

export const gqlResponseSchema = Type.Partial(
  Type.Object({
    data: Type.Any(),
    errors: Type.Any(),
  }),
);

export const createGqlResponseSchema = {
  body: Type.Object(
    {
      query: Type.String(),
      variables: Type.Optional(Type.Record(Type.String(), Type.Any())),
    },
    {
      additionalProperties: false,
    },
  ),
};

export const graphqlSchema = new GraphQLSchema({
  query: Query,
  mutation: Mutation,
});
