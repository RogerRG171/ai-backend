import { db } from '../../db/postgres.ts'
import { questions } from '../../db/schema/questions.ts'

export const makeQuestion = async (question: string, roomId: string) => {
	const result = await db
		.insert(questions)
		.values({ question, roomId })
		.returning()

	return result[0]
}
