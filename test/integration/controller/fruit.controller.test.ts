import { HttpStatus, type INestApplication } from '@nestjs/common'
import { Test } from '@nestjs/testing'
import request from 'supertest'
import { afterEach, beforeEach, describe, it } from 'vitest'

import { IFruitService } from '#application/fruit.service.interface.js'
import { asFruitName, Fruit } from '#domain/fruit.js'
import { type FruitServiceMock, mockFruitService } from '#mocks'
import { FruitController } from '#presentation/http/fruit.controller.js'

describe('AppController', () => {
  let fruitServiceMock: FruitServiceMock
  let app: INestApplication

  beforeEach(async () => {
    fruitServiceMock = mockFruitService()

    const module = await Test.createTestingModule({
      controllers: [FruitController],
      providers: [
        {
          provide: IFruitService,
          useValue: fruitServiceMock,
        },
      ],
    }).compile()

    app = await module.createNestApplication().init()
  })

  afterEach(() => app.close())

  describe('GET /random', () => {
    it('should return a fruit', async () => {
      const fruit = new Fruit({ name: asFruitName('Watermelon'), calories: 30 })

      fruitServiceMock.getRandom.mockReturnValue(fruit)

      await request(app.getHttpServer()).get('/fruits/random').expect(HttpStatus.OK).expect({
        calories: 30,
        name: 'Watermelon',
      })
    })
  })
})
