import { afterAll, beforeAll, expect, test } from 'vitest'
import { server as app } from '../../app.ts'
import { sql } from '../../db/postgres.ts'
import { fakerPT_BR as faker } from '@faker-js/faker'
import supertest from 'supertest'

beforeAll(async () => {
	await app.ready()
})

afterAll(async () => {
	await app.close()
	sql.end()
})

test('should create a new room', async () => {
	const response = await supertest(app.server)
		.post('/rooms')
		.set('Content-Type', 'application/json')
		.send({
			name: faker.person.jobArea(),
			description: faker.person.jobDescriptor(),
		})

	expect(response.status).toBe(201)
	expect(response.body).toHaveProperty('roomId')
})
