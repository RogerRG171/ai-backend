import { afterAll, beforeAll, expect, test } from 'vitest'
import { server as app } from '../../app.ts'
import { sql } from '../../db/postgres.ts'
import { makeRoom } from '../../test/factories/make-room.ts'
import { fakerPT_BR as faker } from '@faker-js/faker'
import supertest from 'supertest'

beforeAll(async () => {
	await app.ready()
})

afterAll(async () => {
	await app.close()
	await sql.end()
})

test('create a question successfully', async () => {
	const newRoom = await makeRoom(
		faker.person.jobArea(),
		faker.person.jobDescriptor(),
	)

	const response = await supertest(app.server)
		.post(`/rooms/${newRoom.id}/questions`)
		.set('Content-Type', 'application/json')
		.send({
			question: `What is the capital of ${faker.location.country()}?`,
		})

	expect(response.status).toBe(201)
	expect(response.body).toHaveProperty('questionId')
})
