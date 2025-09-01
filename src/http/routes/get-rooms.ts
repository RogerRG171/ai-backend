import type { FastifyPluginCallbackZod } from 'fastify-type-provider-zod'
import { db } from '../../db/postgres.ts'
import { rooms } from '../../db/schema/rooms.ts'
import { questions } from '../../db/schema/questions.ts'
import { count, eq } from 'drizzle-orm'

export const getRoomsRoute: FastifyPluginCallbackZod = (server) => {
	server.get('/rooms', {}, async (request, reply) => {
		const result = await db
			.select({
				id: rooms.id,
				name: rooms.name,
				createdAt: rooms.createdAt,
				questionsCount: count(questions.id),
			})
			.from(rooms)
			.leftJoin(questions, eq(questions.roomId, rooms.id))
			.groupBy(rooms.id)
			.orderBy(rooms.createdAt)

		reply.status(200).send({ rooms: result })
	})
}
