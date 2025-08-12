import { readFileSync } from 'node:fs'
import { join } from 'node:path'

import { type INestApplication } from '@nestjs/common'
import type { Database } from '@nestjs-cls/transactional-adapter-pg-promise'
import dayjs from 'dayjs'
import { afterAll, afterEach, beforeAll, beforeEach, describe, expect, it } from 'vitest'

import { ITimeProvider } from '#application/time-provider.interface.js'
import { mockTimeProvider } from '#application/time-provider.mock.js'
import { asAuthorID } from '#domain/author/author-id.js'
import { AuthorNotFoundError } from '#domain/author/author-not-found.error.js'
import { InvalidQuoteError } from '#domain/quote/invalid-quote.error.js'
import { asQuoteID } from '#domain/quote/quote-id.js'
import { QuoteNotFoundError } from '#domain/quote/quote-not-found.error.js'
import { IConnectionProvider } from '#infrastructure/persistence/connection-provider.interface.js'
import { QuoteRepository } from '#infrastructure/persistence/quote/quotes-repository.js'

import { QuoteBuilder } from '../../builder/quote.builder.js'

import { setupDatabaseIntegrationTest } from './setup-database-integration-test.js'

describe('QuoteRepository', () => {
  const now = dayjs('2025-05-19T06:30:00.000Z')
  const fixture = readFileSync(join(import.meta.dirname, 'fixture.sql')).toString('utf8')
  const invalidId = asQuoteID(99)
  const invalidAuthorId = asAuthorID(99)

  const integrationTest = setupDatabaseIntegrationTest()
  const firstQuote = QuoteBuilder.create({
    id: 1,
    text: 'First Quote',
    authorId: 2,
    createdAt: '2025-06-01T00:00:00.000Z',
    updatedAt: '2025-06-01T03:00:00.000Z',
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

    db = app.get(IConnectionProvider).database
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
        .withAuthorID(1)
        .withText('Updated First Quote')
        .build()

      await expect(
        quoteRepository.update(firstQuote.id, {
          text: 'Updated First Quote',
          authorId: updatedQuote.authorId,
        }),
      ).resolves.toEqual(updatedQuote)

      await expect(
        db.one('SELECT * FROM quotes WHERE id=$(id)', { id: firstQuote.id }),
      ).resolves.toEqual({
        id: firstQuote.id,
        text: 'Updated First Quote',
        author_id: 1,
        created_at: dayjs('2025-06-01T00:00:00.000Z'),
        updated_at: now,
      })
    })

    it('should throw if the data is invalid', async () => {
      await expect(() =>
        quoteRepository.update(firstQuote.id, { text: '', authorId: firstQuote.authorId }),
      ).rejects.toThrow(InvalidQuoteError)
    })

    it('should throw if the quote does not exist', async () => {
      await expect(() =>
        quoteRepository.update(invalidId, { text: 'Banana', authorId: asAuthorID(1) }),
      ).rejects.toThrow(QuoteNotFoundError)
    })

    it('should throw if the author does not exist', async () => {
      await expect(() =>
        quoteRepository.update(firstQuote.id, { text: 'Banana', authorId: invalidAuthorId }),
      ).rejects.toThrow(AuthorNotFoundError)
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
      await expect(
        quoteRepository.create({ text: 'Third Quote', authorId: asAuthorID(1) }),
      ).resolves.toEqual({
        id: nextId,
        text: 'Third Quote',
        authorId: 1,
        createdAt: now,
        updatedAt: now,
      })

      await expect(db.one('SELECT * FROM quotes WHERE id=$(id)', { id: nextId })).resolves.toEqual({
        id: nextId,
        text: 'Third Quote',
        author_id: 1,
        created_at: now,
        updated_at: now,
      })
    })

    it('should throw if the data is invalid', async () => {
      await expect(quoteRepository.create({ text: '', authorId: asAuthorID(1) })).rejects.toThrow(
        InvalidQuoteError,
      )

      await expect(
        db.manyOrNone('SELECT * FROM quotes WHERE id=$(id)', { id: nextId }),
      ).resolves.toEqual([])
    })

    it('should throw if the author does not exist', async () => {
      await expect(() =>
        quoteRepository.create({ text: 'Banana', authorId: invalidAuthorId }),
      ).rejects.toThrow(AuthorNotFoundError)
    })
  })
})
