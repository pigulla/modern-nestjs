import { readFileSync } from 'node:fs'
import { join } from 'node:path'

import { type INestApplication } from '@nestjs/common'
import type { Database } from '@nestjs-cls/transactional-adapter-pg-promise'
import dayjs from 'dayjs'
import { afterAll, afterEach, beforeAll, beforeEach, describe, expect, it } from 'vitest'

import { ITimeProvider } from '#application/time-provider.interface.js'
import { mockTimeProvider } from '#application/time-provider.mock.js'
import { InvalidQuoteError } from '#domain/quote/invalid-quote.error.js'
import { Quote } from '#domain/quote/quote.js'
import { asQuoteID } from '#domain/quote/quote-id.js'
import { QuoteNotFoundError } from '#domain/quote/quote-not-found.error.js'
import { IPostgresConnectionProvider } from '#infrastructure/persistence/postgres-connection-provider.interface.js'
import { QuoteRepository } from '#infrastructure/persistence/quote/quotes-repository.js'

import { QuoteBuilder } from '../../builder/quote.builder.js'

import { setupDatabaseIntegrationTest } from './setup-database-integration-test.js'

describe('QuoteRepository', () => {
  const now = dayjs('2025-05-19T06:30:00.000Z')
  const fixture = readFileSync(join(__dirname, 'fixture.sql')).toString('utf8')
  const invalidId = asQuoteID(99)

  const integrationTest = setupDatabaseIntegrationTest()
  const firstQuote = new Quote({
    id: asQuoteID(1),
    text: 'First Quote',
    createdAt: dayjs('2025-06-01T00:00:00.000Z'),
    updatedAt: dayjs('2025-06-01T03:00:00.000Z'),
  })

  let app: INestApplication
  let db: Database
  let quoteRepository: QuoteRepository

  beforeAll(integrationTest.beforeAll)
  afterAll(integrationTest.afterAll)

  beforeEach(async () => {
    await integrationTest.beforeEach()

    const module = await integrationTest
      .createModule({
        testName: QuoteRepository.name,
        providers: [QuoteRepository, { provide: ITimeProvider, useValue: mockTimeProvider(now) }],
      })
      .compile()

    app = await module.createNestApplication().enableShutdownHooks().init()
    quoteRepository = app.get(QuoteRepository)

    db = app.get(IPostgresConnectionProvider).database
    await db.multi(fixture)
  })

  afterEach(async () => {
    await app?.close()
    await integrationTest.afterEach()
  })

  describe('get', () => {
    it('should return a quote', async () => {
      await expect(quoteRepository.get(firstQuote.id)).resolves.toEqual(firstQuote)
    })

    it('should throw', async () => {
      await expect(quoteRepository.get(invalidId)).rejects.toThrow(QuoteNotFoundError)
    })
  })

  describe('update', () => {
    it('should update a quote', async () => {
      const updatedQuote = QuoteBuilder.from(firstQuote)
        .withUpdatedAt(now)
        .withText('Updated First Quote')
        .build()

      await expect(
        quoteRepository.update(firstQuote.id, { text: 'Updated First Quote' }),
      ).resolves.toEqual(updatedQuote)

      await expect(
        db.one('SELECT * FROM quotes WHERE id=$(id)', { id: firstQuote.id }),
      ).resolves.toEqual({
        id: firstQuote.id,
        text: 'Updated First Quote',
        created_at: dayjs('2025-06-01T00:00:00.000Z'),
        updated_at: now,
      })
    })

    it('should throw', async () => {
      await expect(() => quoteRepository.update(invalidId, { text: 'Banana' })).rejects.toThrow(
        QuoteNotFoundError,
      )
    })
  })

  describe('delete', () => {
    it('should delete a quote', async () => {
      await expect(quoteRepository.delete(firstQuote.id)).resolves.toBeUndefined()

      await expect(
        db.manyOrNone('SELECT * FROM quotes WHERE id=$(id)', { id: firstQuote.id }),
      ).resolves.toEqual([])
    })

    it('should throw', async () => {
      await expect(() => quoteRepository.delete(invalidId)).rejects.toThrow(QuoteNotFoundError)
    })
  })

  describe('create', () => {
    const nextId = asQuoteID(3)

    it('should create a quote', async () => {
      await expect(quoteRepository.create({ text: 'Third Quote' })).resolves.toEqual({
        id: nextId,
        text: 'Third Quote',
        createdAt: now,
        updatedAt: now,
      })

      await expect(db.one('SELECT * FROM quotes WHERE id=$(id)', { id: nextId })).resolves.toEqual({
        id: nextId,
        text: 'Third Quote',
        created_at: now,
        updated_at: now,
      })
    })

    it('should throw', async () => {
      await expect(quoteRepository.create({ text: '' })).rejects.toThrow(InvalidQuoteError)

      await expect(
        db.manyOrNone('SELECT * FROM quotes WHERE id=$(id)', { id: nextId }),
      ).resolves.toEqual([])
    })
  })
})
