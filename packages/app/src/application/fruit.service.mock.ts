import { type Mocked, vi } from 'vitest'

import { type IFruitService } from './fruit.service.interface.js'

export type FruitServiceMock = Mocked<IFruitService>

export function mockFruitService(): FruitServiceMock {
  return {
    get: vi.fn(),
    update: vi.fn(),
    create: vi.fn(),
    delete: vi.fn(),
    getRandom: vi.fn(),
  }
}
