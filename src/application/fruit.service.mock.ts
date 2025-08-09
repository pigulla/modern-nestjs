import { type Mocked, vi } from 'vitest'

import { type IFruitService } from './fruit.service.interface.js'

export type FruitServiceMock = Mocked<IFruitService>

export function mockFruitService(): FruitServiceMock {
  return {
    getRandom: vi.fn(),
  }
}
