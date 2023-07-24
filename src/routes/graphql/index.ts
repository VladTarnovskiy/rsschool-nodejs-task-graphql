import { FastifyPluginAsyncTypebox } from '@fastify/type-provider-typebox';
import depthLimit from 'graphql-depth-limit';
import { createGqlResponseSchema, gqlResponseSchema } from './schemas.js';
import { GraphQLError, graphql, parse, validate } from 'graphql';
import { graphqlSchema } from './schemas.js';
import DataLoader from 'dataloader';
import {
  loaderMemberTypes,
  loaderProfiles,
  loaderUserPosts,
  loaderUserRelations,
} from './dataLoaders.js';

const plugin: FastifyPluginAsyncTypebox = async (fastify) => {
  fastify.route({
    url: '/',
    method: 'POST',
    schema: {
      ...createGqlResponseSchema,
      response: {
        200: gqlResponseSchema,
      },
    },
    async handler({ body }) {
      const { variables, query } = body;

      try {
        const documentAST = parse(query);
        const validationErrors = validate(graphqlSchema, documentAST, [depthLimit(5)]);

        if (validationErrors.length > 0) {
          return { errors: validationErrors };
        }

        const dataLoaders = {
          profileLoader: new DataLoader((userIds) =>
            loaderProfiles(userIds as string[], fastify),
          ),
          userPostsLoader: new DataLoader((userIds) =>
            loaderUserPosts(userIds as string[], fastify),
          ),
          userRelationsLoader: new DataLoader((userIds) =>
            loaderUserRelations(userIds as string[], fastify),
          ),
          memberTypeLoader: new DataLoader((memberTypeIds) =>
            loaderMemberTypes(memberTypeIds as string[], fastify),
          ),
        };

        const result = await graphql({
          schema: graphqlSchema,
          source: query,
          variableValues: variables,
          contextValue: { fastify, dataLoaders },
        });

        return result;
      } catch (error) {
        if (error instanceof GraphQLError || error instanceof Error) {
          return { errors: [{ message: error.message }] };
        }
      }
    },
  });
};

export default plugin;
