import type { FastifyPluginCallbackZod } from 'fastify-type-provider-zod'
import z from 'zod'
import { db } from '../../db/postgres.ts'
import { rooms } from '../../db/schema/rooms.ts'

export const createRoomRoute: FastifyPluginCallbackZod = async (server) => {
	server.post(
		'/rooms',
		{
			schema: {
				body: z.object({
					name: z.string().min(3).max(150),
					description: z.string().optional(),
				}),
				response: {
					201: z.object({
						roomId: z.uuid(),
					}),
				},
			},
		},
		async (request, reply) => {
			const { name, description } = request.body

			const [result] = await db
				.insert(rooms)
				.values({ name, description })
				.returning()

			if (!result) {
				throw new Error('Failed to create room')
			}

			return reply.status(201).send({
				roomId: result.id,
			})
		},
	)
}
