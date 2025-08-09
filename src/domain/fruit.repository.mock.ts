import { type Mocked, vi } from 'vitest'

import { type IFruitRepository } from './fruit.repository.interface.js'

export type FruitRepositoryMock = Mocked<IFruitRepository>

export function mockFruitRepository(): FruitRepositoryMock {
  return {
    getAll: vi.fn(),
  }
}
