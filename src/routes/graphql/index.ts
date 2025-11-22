import { FastifyPluginAsyncTypebox } from '@fastify/type-provider-typebox';
import { createGqlResponseSchema, gqlResponseSchema } from './schemas.js';
import { graphql, GraphQLSchema } from 'graphql';
import { createRootType } from './types/factory.js';

const plugin: FastifyPluginAsyncTypebox = async (fastify) => {
  const { prisma } = fastify;

  // Create all types once
  const rootQueryType = createRootType(prisma);

  // Build schema
  const schema = new GraphQLSchema({
    query: rootQueryType,
    // mutation: Mutations,
  });

  fastify.route({
    url: '/',
    method: 'POST',
    schema: {
      ...createGqlResponseSchema,
      response: {
        200: gqlResponseSchema,
      },
    },
    async handler(req) {
      const result = await graphql({
        schema,
        source: req.body.query,
        variableValues: req.body.variables,
      });
      return result;
    },
  });
};

export default plugin;
