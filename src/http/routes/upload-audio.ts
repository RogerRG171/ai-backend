import type { FastifyPluginCallbackZod } from 'fastify-type-provider-zod'
import z from 'zod'
import { generateEmbeddings, transcribe } from '../../services/gemini.ts'
import { db } from '../../db/postgres.ts'
import { audioChunks } from '../../db/schema/audio-chunks.ts'

export const uploadAudioRoute: FastifyPluginCallbackZod = async (server) => {
	return server.post(
		'/rooms/:roomId/audio',
		{
			schema: {
				params: z.object({
					roomId: z.string(),
				}),
			},
		},
		async (request, reply) => {
			const { roomId } = request.params

			const audio = await request.file()

			if (!audio) {
				throw new Error('Audio is required.')
			}

			const audioBuffer = await audio.toBuffer()
			const audioBase64 = audioBuffer.toString('base64')

			const transcription = await transcribe(audioBase64, audio.mimetype)

			const embeddings = await generateEmbeddings(transcription)

			const result = await db
				.insert(audioChunks)
				.values({ roomId, transcription, embeddings })
				.returning()

			const chunk = result[0]

			if (!chunk) {
				throw new Error('Failed to insert audio chunk')
			}

			return reply.status(201).send({
				chunkId: chunk.id,
			})
		},
	)
}
