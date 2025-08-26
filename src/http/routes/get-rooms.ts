import type { FastifyPluginCallbackZod } from 'fastify-type-provider-zod'
import { db } from '../../db/postgres.ts'
import { rooms } from '../../db/schema/rooms.ts'

export const getRoomsRoute: FastifyPluginCallbackZod = (server) => {
	server.get('/rooms', {}, async (request, reply) => {
		const result = await db
			.select({
				id: rooms.id,
				name: rooms.name,
			})
			.from(rooms)
			.orderBy(rooms.createdAt)

		reply.status(200).send({ rooms: result })
	})
}
