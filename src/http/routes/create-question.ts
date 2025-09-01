import type { FastifyPluginCallbackZod } from 'fastify-type-provider-zod'
import { z } from 'zod'
import { db } from '../../db/postgres.ts'
import { questions } from '../../db/schema/questions.ts'

export const createQuestionRoute: FastifyPluginCallbackZod = async (server) => {
	server.post(
		'/rooms/:roomId/questions',
		{
			schema: {
				params: z.object({
					roomId: z.string(),
				}),
				body: z.object({
					question: z.string().min(3).max(255),
				}),
			},
		},
		async (request, reply) => {
			const { question } = request.body
			const { roomId } = request.params

			const [result] = await db
				.insert(questions)
				.values({ question, roomId })
				.returning()

			if (!result) {
				throw new Error('Failed to create question')
			}

			reply.status(201).send({
				questionId: result.id,
			})
		},
	)
}
