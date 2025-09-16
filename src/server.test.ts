import { test, expect, beforeAll, afterAll } from 'vitest'
import { server as app } from './app.ts'
import supertest from 'supertest'

beforeAll(async () => {
	await app.ready()
})

afterAll(async () => {
	await app.close()
})

test('should return ok status code 200', async () => {
	const response = await supertest(app.server).get('/health')

	expect(response.status).toBe(200)
	expect(response.body).toEqual({ status: 'ok' })
})
