import type { FastifyPluginCallbackZod } from 'fastify-type-provider-zod'
import { z } from 'zod'
import { db } from '../../db/postgres.ts'
import { questions } from '../../db/schema/questions.ts'
import { generateAnswer, generateEmbeddings } from '../../services/gemini.ts'
import { audioChunks } from '../../db/schema/audio-chunks.ts'
import { and, eq, sql } from 'drizzle-orm'

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

			const embeddings = await generateEmbeddings(question)

			const embeddingsAsString = `[${embeddings.join(',')}]`

			const chunks = await db
				.select({
					id: audioChunks.id,
					transcription: audioChunks.transcription,
					similarity: sql<number>`1 - (${audioChunks.embeddings} <=> ${embeddingsAsString}::vector)`,
				})
				.from(audioChunks)
				.where(
					and(
						eq(audioChunks.roomId, roomId),
						sql`1 - (${audioChunks.embeddings} <=> ${embeddingsAsString}::vector) > 0.7`,
					),
				)
				.orderBy(
					sql`${audioChunks.embeddings} <=> ${embeddingsAsString}::vector`,
				)
				.limit(3)

			let answer: string | null = null

			if (chunks.length > 0) {
				const transcriptions = chunks.map((chunk) => chunk.transcription)

				answer = await generateAnswer(question, transcriptions)
			}

			const [result] = await db
				.insert(questions)
				.values({ question, roomId, answer })
				.returning()

			if (!result) {
				throw new Error('Failed to create question')
			}

			reply.status(201).send({
				questionId: result.id,
				answer,
			})
		},
	)
}
