import { type Mocked, vi } from 'vitest'

import { type IFruitRepository } from './fruit.repository.interface.js'

export type FruitRepositoryMock = Mocked<IFruitRepository>

export function mockFruitRepository(): FruitRepositoryMock {
  return {
    create: vi.fn(),
    get: vi.fn(),
    getAll: vi.fn(),
    delete: vi.fn(),
    update: vi.fn(),
  }
}
