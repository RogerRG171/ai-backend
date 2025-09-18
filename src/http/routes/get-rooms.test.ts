import { afterAll, beforeAll, expect, test } from 'vitest'
import { server as app } from '../../app.ts'
import supertest from 'supertest'
import { sql } from '../../db/postgres.ts'

beforeAll(async () => {
	await app.ready()
})

afterAll(async () => {
	await app.close()
	await sql.end()
})

test('should return all rooms', async () => {
	const response = await supertest(app.server).get('/rooms')

	expect(response.status).toBe(200)
	expect(response.body).toMatchObject({
		rooms: expect.any(Array),
	})
})
