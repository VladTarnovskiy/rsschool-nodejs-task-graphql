import { FastifyPluginAsyncTypebox } from '@fastify/type-provider-typebox';
import { createGqlResponseSchema, gqlResponseSchema } from './schemas.js';
import { graphql, GraphQLSchema, validate, parse } from 'graphql';
import { createSchema } from './factory.js';
import depthLimit from 'graphql-depth-limit';

const plugin: FastifyPluginAsyncTypebox = async (fastify) => {
  const { prisma } = fastify;

  // Create all types once
  const { rootQueryType, mutations } = createSchema(prisma);

  // Build schema
  const schema = new GraphQLSchema({
    query: rootQueryType,
    mutation: mutations,
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
      const document = parse(req.body.query);
      const validationErrors = validate(schema, document, [depthLimit(5)]);

      if (validationErrors.length > 0) {
        return {
          errors: validationErrors,
        };
      }

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
