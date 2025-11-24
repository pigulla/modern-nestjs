import { Fruit } from '@modern-nestjs/domain/fruit.js'

import { Test } from '@nestjs/testing'
import { beforeEach, describe, expect, it } from 'vitest'

import { IFruitRepository } from '#domain/fruit.repository.interface.js'
import { type FruitRepositoryMock, mockFruitRepository } from '#domain/fruit.repository.mock.js'

import { FruitService } from './fruit.service.js'

describe('AppService', () => {
  let fruitRepositoryMock: FruitRepositoryMock
  let fruitService: FruitService

  beforeEach(async () => {
    fruitRepositoryMock = mockFruitRepository()

    const module = await Test.createTestingModule({
      providers: [FruitService, { provide: IFruitRepository, useValue: fruitRepositoryMock }],
    }).compile()

    fruitService = module.createNestApplication({ logger: false }).get(FruitService)
  })

  it('should do things', () => {
    const fruit = Fruit.create({ id: 42, name: 'Watermelon', calories: 30 })

    fruitRepositoryMock.getAll.mockReturnValue([fruit])

    expect(fruitService.getRandom()).toBe(fruit)
  })
})
