import { afterAll, beforeAll, expect, test } from 'vitest'
import { server as app } from '../../app.ts'
import { sql } from '../../db/postgres.ts'
import supertest from 'supertest'
import { makeRoom } from '../../test/factories/make-room.ts'
import { fakerPT_BR as faker } from '@faker-js/faker'
import { makeQuestion } from '../../test/factories/make-question.ts'

beforeAll(async () => {
	await app.ready()
})

afterAll(async () => {
	await app.close()
	await sql.end()
})

test('get room questions successfully', async () => {
	const name = faker.person.jobArea()
	const description = faker.person.jobDescriptor()
	const question = `What is the capital of ${faker.location.country()}?`

	const newRoom = await makeRoom(name, description)

	const newQuestion = await makeQuestion(question, newRoom.id)

	const response = await supertest(app.server).get(
		`/rooms/${newRoom.id}/questions`,
	)

	expect(response.body).toEqual({
		questions: [
			{
				id: expect.any(String),
				createdAt: expect.any(String),
				roomId: newQuestion.roomId,
				question: newQuestion.question,
				answer: null,
			},
		],
	})
})
