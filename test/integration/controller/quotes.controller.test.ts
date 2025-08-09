import { HttpStatus, type INestApplication } from '@nestjs/common'
import { APP_INTERCEPTOR, APP_PIPE } from '@nestjs/core'
import { Test } from '@nestjs/testing'
import { ZodSerializerInterceptor, ZodValidationPipe } from 'nestjs-zod'
import request from 'supertest'
import { afterEach, beforeEach, describe, expect, it } from 'vitest'

import { IQuoteRepository } from '#domain/quote/quote-repository.interface.js'
import {
  mockQuoteRepository,
  type QuoteRepositoryMock,
} from '#domain/quote/quote-repository.mock.js'
import { QuotesController } from '#presentation/http/quote/quotes.controller.js'

import { QuoteBuilder } from '../../builder/quote.builder.js'

describe('QuotesController', () => {
  const quote = QuoteBuilder.create({
    id: 42,
    text: 'Lorem ipsum dolor sit amet.',
    createdAt: '2025-05-19T06:30:00.000Z',
    updatedAt: '2025-05-19T06:30:00.000Z',
  })

  let quoteRepositoryMock: QuoteRepositoryMock
  let app: INestApplication

  beforeEach(async () => {
    quoteRepositoryMock = mockQuoteRepository()

    const module = await Test.createTestingModule({
      controllers: [QuotesController],
      providers: [
        { provide: APP_INTERCEPTOR, useClass: ZodSerializerInterceptor },
        { provide: APP_PIPE, useClass: ZodValidationPipe },
        { provide: IQuoteRepository, useValue: quoteRepositoryMock },
      ],
    }).compile()

    app = await module.createNestApplication({ logger: false }).enableShutdownHooks().init()
  })

  afterEach(() => app.close())

  describe('GET /quotes/random', () => {
    it('should return 200 OK', async () => {
      quoteRepositoryMock.getRandom.mockResolvedValue(quote)

      await request(app.getHttpServer()).get('/quotes/random').expect(HttpStatus.OK).expect({
        id: 42,
        text: 'Lorem ipsum dolor sit amet.',
        createdAt: '2025-05-19T06:30:00.000Z',
        updatedAt: '2025-05-19T06:30:00.000Z',
      })

      expect(quoteRepositoryMock.getRandom).toHaveBeenCalledExactlyOnceWith()
    })
  })

  describe('POST /quotes', () => {
    it('should return 200 OK', async () => {
      quoteRepositoryMock.create.mockResolvedValue(quote)

      await request(app.getHttpServer())
        .post('/quotes')
        .send({
          text: 'Lorem ipsum dolor sit amet.',
        })
        .expect(HttpStatus.CREATED)
        .expect({
          id: 42,
          text: 'Lorem ipsum dolor sit amet.',
          createdAt: '2025-05-19T06:30:00.000Z',
          updatedAt: '2025-05-19T06:30:00.000Z',
        })

      expect(quoteRepositoryMock.create).toHaveBeenCalledExactlyOnceWith({
        text: 'Lorem ipsum dolor sit amet.',
      })
    })

    it.each<[string, string | object]>([
      ['no data', ''],
      ['an empty object', {}],
      ['no text', { text: '' }],
      ['text that is invalid', { text: 42 }],
      ['text that is too long', { text: 'X'.repeat(1001) }],
    ])('should return 400 Bad Request with %s', async data => {
      await request(app.getHttpServer()).post('/quotes').send(data).expect(HttpStatus.BAD_REQUEST)

      expect(quoteRepositoryMock.create).not.toHaveBeenCalled()
    })

    it('should return 500 Internal Server Error', async () => {
      quoteRepositoryMock.create.mockRejectedValue(new Error('Boom'))

      await request(app.getHttpServer())
        .post('/quotes')
        .send({ text: 'Lorem ipsum dolor sit amet.' })
        .expect(HttpStatus.INTERNAL_SERVER_ERROR)
        .expect({ statusCode: HttpStatus.INTERNAL_SERVER_ERROR, message: 'Internal server error' })
    })
  })
})
