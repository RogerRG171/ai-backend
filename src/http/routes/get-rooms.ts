import type { FastifyPluginCallbackZod } from 'fastify-type-provider-zod'
import { db } from '../../db/postgres.ts'
import { rooms } from '../../db/schema/rooms.ts'
import { questions } from '../../db/schema/questions.ts'
import { count, desc, eq } from 'drizzle-orm'
import z from 'zod'

export const getRoomsRoute: FastifyPluginCallbackZod = (server) => {
	server.get(
		'/rooms',
		{
			schema: {
				tags: ['Rooms'],
				summary: 'Get all rooms',
				description: 'Get all rooms with their questions count',

				response: {
					200: z
						.object({
							rooms: z.array(
								z.object({
									id: z.string(),
									name: z.string(),
									createdAt: z.date(),
									questionsCount: z.number(),
								}),
							),
						})
						.describe(
							'Return Rooms with their questions count ordered by createdAt descending',
						),
				},
			},
		},
		async (request, reply) => {
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
				.orderBy(desc(rooms.createdAt))

			reply.status(200).send({ rooms: result })
		},
	)
}
