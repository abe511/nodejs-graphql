import { FastifyPluginAsyncJsonSchemaToTs } from '@fastify/type-provider-json-schema-to-ts';
import { idParamSchema } from '../../utils/reusedSchemas';
import { createUserBodySchema, changeUserBodySchema, subscribeBodySchema } from './schemas';
import type { UserEntity } from '../../utils/DB/entities/DBUsers';

const plugin: FastifyPluginAsyncJsonSchemaToTs = async (fastify): Promise<void> => {
  fastify.get('/', async function (request, reply): Promise<UserEntity[]> {
    return await this.db.users.findMany();
  });

  fastify.get(
    '/:id',
    {
      schema: {
        params: idParamSchema,
      },
    },
    async function (request, reply): Promise<UserEntity> {
      let user;
      try {
        user = await this.db.users.findOne({key: "id", equals: request.params.id});
        if(!user) {
          reply.notFound();
        }
      } catch (err) {
        reply.badRequest();
      }
      return reply.send(user);
    }
  );

  fastify.post(
    '/',
    {
      schema: {
        body: createUserBodySchema,
      },
    },
    async function (request, reply): Promise<UserEntity> {
        fastify.log.info("kuku",request.body);
      
        const newUser: UserEntity = await this.db.users.create(request.body);
        reply.statusCode = 400;
        return reply.send(newUser);
      }
    );

  fastify.delete(
    '/:id',
    {
      schema: {
        params: idParamSchema,
      },
    },
    async function (request, reply): Promise<UserEntity> {
      const user = await this.db.users.delete(request.params.id);
      return reply.send(user);
    }
  );

  fastify.post(
    '/:id/subscribeTo',
    {
      schema: {
        body: subscribeBodySchema,
        params: idParamSchema,
      },
    },
    async function (request, reply): Promise<UserEntity> {
      const users = await this.db.users.findMany();
      return reply.send(users);
    }
  );

  fastify.post(
    '/:id/unsubscribeFrom',
    {
      schema: {
        body: subscribeBodySchema,
        params: idParamSchema,
      },
    },
    async function (request, reply): Promise<UserEntity> {
      const users = await this.db.users.findMany();
      return reply.send(users);
    }
  );

  fastify.patch(
    '/:id',
    {
      schema: {
        body: changeUserBodySchema,
        params: idParamSchema,
      },
    },
    async function (request, reply): Promise<UserEntity> {
      const user = await this.db.users.change(request.params.id, request.body);
      reply.statusCode = 400;
      return reply.send(user);
    }
  );
};

export default plugin;
