import type { FastifyPluginCallbackZod } from 'fastify-type-provider-zod'
import z from 'zod'
import { db } from '../../db/postgres.ts'
import { desc, eq } from 'drizzle-orm'
import { questions } from '../../db/schema/questions.ts'

export const getRoomQuestionsRoute: FastifyPluginCallbackZod = async (
	server,
) => {
	server.get(
		'/rooms/:roomId/questions',
		{
			schema: {
				tags: ['Questions'],
				summary: 'Get all questions for a room',
				description: 'Get all questions for a room with a roomId',
				params: z.object({
					roomId: z.string().describe(' A valid uuid'),
				}),
				response: {
					200: z
						.object({
							questions: z.array(
								z.object({
									id: z.string(),
									question: z.string(),
									answer: z.string().nullable(),
									createdAt: z.date(),
								}),
							),
						})
						.describe('Return Questions ordered by createdAt descending'),
				},
			},
		},
		async (request, reply) => {
			const { roomId } = request.params

			const result = await db
				.select({
					id: questions.id,
					question: questions.question,
					answer: questions.answer,
					createdAt: questions.createdAt,
				})
				.from(questions)
				.where(eq(questions.roomId, roomId))
				.orderBy(desc(questions.createdAt))

			return reply.status(200).send({
				questions: result,
			})
		},
	)
}
