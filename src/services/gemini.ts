import { GoogleGenAI } from '@google/genai'
import { env } from '../env.ts'

const gemini = new GoogleGenAI({
	apiKey: env.API_KEY,
})

const model = 'gemini-2.5-flash'

export const transcribe = async (audioAsBase64: string, mimeType: string) => {
	const response = await gemini.models.generateContent({
		model,
		contents: [
			{
				text:
					'Transcreva o áudio para português BR.' +
					' Seja breve e natural na transcrição.' +
					' Mantenha a pontuação adequada e divida o text em paragráfos quando for apropriado.',
			},
			{
				inlineData: {
					mimeType,
					data: audioAsBase64,
				},
			},
		],
	})

	if (!response.text) {
		throw new Error('Error to transcribe.')
	}

	return response.text
}

export const generateEmbeddings = async (text: string) => {
	const response = await gemini.models.embedContent({
		model: 'text-embedding-004',
		contents: [{ text }],
		config: {
			taskType: 'RETRIEVAL_DOCUMENT',
		},
	})

	if (!response.embeddings?.[0].values) {
		throw new Error('Failed to embedding')
	}

	return response.embeddings?.[0].values
}
