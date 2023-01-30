import { FastifyPluginAsyncJsonSchemaToTs } from '@fastify/type-provider-json-schema-to-ts';
import { idParamSchema } from '../../utils/reusedSchemas';
import { createProfileBodySchema, changeProfileBodySchema } from './schema';
import type { ProfileEntity } from '../../utils/DB/entities/DBProfiles';

const plugin: FastifyPluginAsyncJsonSchemaToTs = async (
  fastify
): Promise<void> => {
  fastify.get('/', async function (request, reply): Promise<
    ProfileEntity[]
  > {
    return await this.db.profiles.findMany();
  });

  fastify.get(
    '/:id',
    {
      schema: {
        params: idParamSchema,
      },
    },
    async function (request, reply): Promise<ProfileEntity> {
      let profile;
      try {
        profile = await this.db.profiles.findOne({key: "id", equals: request.params.id});
        if(!profile) {
          reply.notFound();
        }
      } catch (err) {
        reply.badRequest();
      }
      return reply.send(profile);
    }
  );

  fastify.post(
    '/',
    {
      schema: {
        body: createProfileBodySchema,
      },
    },
    async function (request, reply): Promise<ProfileEntity> {
      const newProfile: ProfileEntity = await this.db.profiles.create(request.body);
      return reply.send(newProfile);
    }
  );

  fastify.delete(
    '/:id',
    {
      schema: {
        params: idParamSchema,
      },
    },
    async function (request, reply): Promise<ProfileEntity> {
      let profile;
      if(request.params.id) {
        profile = await this.db.profiles.delete(request.params.id);
      }
      return reply.send(profile);
    }
  );

  fastify.patch(
    '/:id',
    {
      schema: {
        body: changeProfileBodySchema,
        params: idParamSchema,
      },
    },
    async function (request, reply): Promise<ProfileEntity> {
      const profile = await this.db.profiles.change(request.params.id, request.body);
      return reply.send(profile);
    }
  );
};

export default plugin;
