import { beforeEach, describe, expect, it } from 'vitest'

import { Fruit } from '#domain/fruit.js'
import { type FruitRepositoryMock, mockFruitRepository } from '#domain/fruit.repository.mock.js'

import { FruitService } from './fruit.service.js'

describe('AppService', () => {
  let fruitRepositoryMock: FruitRepositoryMock
  let fruitService: FruitService

  beforeEach(() => {
    fruitRepositoryMock = mockFruitRepository()
    fruitService = new FruitService(fruitRepositoryMock)
  })

  it('should do things', () => {
    const fruit = new Fruit({ name: 'Watermelon', calories: 30 })

    fruitRepositoryMock.getAll.mockReturnValue([fruit])

    expect(fruitService.getRandom()).toBe(fruit)
  })
})
