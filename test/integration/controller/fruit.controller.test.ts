import { HttpStatus, type INestApplication } from '@nestjs/common'
import { APP_INTERCEPTOR, APP_PIPE } from '@nestjs/core'
import { Test } from '@nestjs/testing'
import { ZodSerializerInterceptor, ZodValidationPipe } from 'nestjs-zod'
import request from 'supertest'
import { afterEach, beforeEach, describe, expect, it } from 'vitest'

import { IFruitService } from '#application/fruit.service.interface.js'
import { FruitAlreadyExistsError } from '#domain/error/fruit-already-exists.error.js'
import { FruitNotFoundError } from '#domain/error/fruit-not-found.error.js'
import { asFruitID, Fruit } from '#domain/fruit.js'
import { type FruitServiceMock, mockFruitService } from '#mocks'
import { FruitController } from '#presentation/http/fruit.controller.js'

describe('AppController', () => {
  const banana = Fruit.create({ id: 42, name: 'Banana', calories: 30 })

  let fruitServiceMock: FruitServiceMock
  let app: INestApplication

  beforeEach(async () => {
    fruitServiceMock = mockFruitService()

    const module = await Test.createTestingModule({
      controllers: [FruitController],
      providers: [
        { provide: APP_INTERCEPTOR, useClass: ZodSerializerInterceptor },
        { provide: APP_PIPE, useClass: ZodValidationPipe },
        {
          provide: IFruitService,
          useValue: fruitServiceMock,
        },
      ],
    }).compile()

    app = await module.createNestApplication({ logger: false }).init()
  })

  afterEach(() => app.close())

  describe('GET /random', () => {
    afterEach(() => {
      expect(fruitServiceMock.getRandom).toHaveBeenCalledExactlyOnceWith()
    })

    it('should return a 200', async () => {
      fruitServiceMock.getRandom.mockReturnValue(banana)

      await request(app.getHttpServer()).get('/fruits/random').expect(HttpStatus.OK).expect({
        id: banana.id,
        calories: banana.calories,
        name: banana.name,
      })
    })

    it('should return a 404', async () => {
      fruitServiceMock.getRandom.mockReturnValue(null)

      await request(app.getHttpServer()).get('/fruits/random').expect(HttpStatus.NOT_FOUND)
    })

    it('should return a 500', async () => {
      fruitServiceMock.getRandom.mockImplementation(() => {
        throw new Error('Boom!')
      })

      await request(app.getHttpServer())
        .get('/fruits/random')
        .expect(HttpStatus.INTERNAL_SERVER_ERROR)
    })
  })

  describe('GET /42', () => {
    it('should return a 200', async () => {
      fruitServiceMock.get.mockReturnValue(banana)

      await request(app.getHttpServer())
        .get('/fruits/42')
        .expect(HttpStatus.OK)
        .expect({ id: banana.id, calories: banana.calories, name: banana.name })

      expect(fruitServiceMock.get).toHaveBeenCalledExactlyOnceWith(banana.id)
    })

    it('should return a 400', async () => {
      await request(app.getHttpServer()).get('/fruits/banana').expect(HttpStatus.BAD_REQUEST)

      expect(fruitServiceMock.get).not.toHaveBeenCalled()
    })

    it('should return a 404', async () => {
      fruitServiceMock.get.mockImplementation(() => {
        throw new FruitNotFoundError(banana.id)
      })

      await request(app.getHttpServer()).get('/fruits/42').expect(HttpStatus.NOT_FOUND)

      expect(fruitServiceMock.get).toHaveBeenCalledExactlyOnceWith(banana.id)
    })

    it('should return a 500', async () => {
      fruitServiceMock.get.mockImplementation(() => {
        throw new Error('Boom!')
      })

      await request(app.getHttpServer()).get('/fruits/42').expect(HttpStatus.INTERNAL_SERVER_ERROR)

      expect(fruitServiceMock.get).toHaveBeenCalledExactlyOnceWith(banana.id)
    })
  })

  describe('DELETE /42', () => {
    it('should return a 204', async () => {
      await request(app.getHttpServer()).delete('/fruits/42').expect(HttpStatus.NO_CONTENT)

      expect(fruitServiceMock.delete).toHaveBeenCalledExactlyOnceWith(banana.id)
    })

    it('should return a 400', async () => {
      await request(app.getHttpServer()).delete('/fruits/banana').expect(HttpStatus.BAD_REQUEST)

      expect(fruitServiceMock.delete).not.toHaveBeenCalled()
    })

    it('should return a 404', async () => {
      fruitServiceMock.delete.mockImplementation(() => {
        throw new FruitNotFoundError(banana.id)
      })

      await request(app.getHttpServer()).delete('/fruits/42').expect(HttpStatus.NOT_FOUND)

      expect(fruitServiceMock.delete).toHaveBeenCalledExactlyOnceWith(banana.id)
    })

    it('should return a 500', async () => {
      fruitServiceMock.delete.mockImplementation(() => {
        throw new Error('Boom!')
      })

      await request(app.getHttpServer())
        .delete('/fruits/42')
        .expect(HttpStatus.INTERNAL_SERVER_ERROR)

      expect(fruitServiceMock.delete).toHaveBeenCalledExactlyOnceWith(banana.id)
    })
  })

  describe('PUT /42', () => {
    it('should return a 200', async () => {
      fruitServiceMock.update.mockReturnValue(
        new Fruit({ id: banana.id, name: banana.name, calories: 13 }),
      )

      await request(app.getHttpServer())
        .put('/fruits/42')
        .send({ id: banana.id, name: banana.name, calories: 13 })
        .expect(HttpStatus.OK)
        .expect({ id: banana.id, name: banana.name, calories: 13 })

      expect(fruitServiceMock.update).toHaveBeenCalledExactlyOnceWith({
        id: banana.id,
        name: banana.name,
        calories: 13,
      })
    })

    it('should return a 400 if the id is invalid', async () => {
      await request(app.getHttpServer())
        .put('/fruits/banana')
        .send({ id: banana.id, name: banana.name, calories: 13 })
        .expect(HttpStatus.BAD_REQUEST)

      expect(fruitServiceMock.delete).not.toHaveBeenCalled()
    })

    it(`should return a 400 if the names don't match`, async () => {
      await request(app.getHttpServer())
        .put('/fruits/42')
        .send({ id: asFruitID(1), name: banana.name, calories: 13 })
        .expect(HttpStatus.BAD_REQUEST)

      expect(fruitServiceMock.update).not.toHaveBeenCalled()
    })

    it('should return a 400 if the payload is invalid', async () => {
      await request(app.getHttpServer())
        .put('/fruits/42')
        .send({ id: banana.id, name: banana.name, calories: -4 })
        .expect(HttpStatus.BAD_REQUEST)

      expect(fruitServiceMock.update).not.toHaveBeenCalled()
    })

    it('should return a 404', async () => {
      fruitServiceMock.update.mockImplementation(() => {
        throw new FruitNotFoundError(banana.id)
      })

      await request(app.getHttpServer())
        .put('/fruits/42')
        .send({ id: banana.id, name: banana.name, calories: 13 })
        .expect(HttpStatus.NOT_FOUND)

      expect(fruitServiceMock.update).toHaveBeenCalledExactlyOnceWith({
        id: banana.id,
        name: banana.name,
        calories: 13,
      })
    })

    it('should return a 404', async () => {
      fruitServiceMock.delete.mockImplementation(() => {
        throw new FruitNotFoundError(banana.id)
      })

      await request(app.getHttpServer()).delete('/fruits/42').expect(HttpStatus.NOT_FOUND)
    })

    it('should return a 500', async () => {
      fruitServiceMock.delete.mockImplementation(() => {
        throw new Error('Boom!')
      })

      await request(app.getHttpServer())
        .delete('/fruits/42')
        .expect(HttpStatus.INTERNAL_SERVER_ERROR)
    })
  })

  describe('POST /', () => {
    it('should return a 201', async () => {
      fruitServiceMock.create.mockReturnValue(banana)

      await request(app.getHttpServer())
        .post('/fruits')
        .send({ id: banana.id, name: banana.name, calories: banana.calories })
        .expect(HttpStatus.CREATED)
        .expect({ id: banana.id, name: banana.name, calories: banana.calories })

      expect(fruitServiceMock.create).toHaveBeenCalledExactlyOnceWith(banana)
    })

    it('should return a 400', async () => {
      await request(app.getHttpServer())
        .post('/fruits')
        .send({ id: banana.id, name: banana.name, calories: -4 })
        .expect(HttpStatus.BAD_REQUEST)

      expect(fruitServiceMock.create).not.toHaveBeenCalled()
    })

    it('should return a 409', async () => {
      fruitServiceMock.create.mockImplementation(() => {
        throw new FruitAlreadyExistsError(banana.name)
      })

      await request(app.getHttpServer())
        .post('/fruits')
        .send({ id: banana.id, name: banana.name, calories: banana.calories })
        .expect(HttpStatus.CONFLICT)

      expect(fruitServiceMock.create).toHaveBeenCalledExactlyOnceWith(banana)
    })

    it('should return a 500', async () => {
      fruitServiceMock.create.mockImplementation(() => {
        throw new Error('Boom!')
      })

      await request(app.getHttpServer())
        .post('/fruits')
        .send({ id: banana.id, name: banana.name, calories: banana.calories })
        .expect(HttpStatus.INTERNAL_SERVER_ERROR)
    })
  })
})
