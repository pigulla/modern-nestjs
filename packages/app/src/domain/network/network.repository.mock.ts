import { type Mocked, vi } from 'vitest'

import { type INetworkRepository } from './network.repository.interface.js'

export type NetworkRepositoryMock = Mocked<INetworkRepository>

export function mockNetworkRepository(): NetworkRepositoryMock {
  return {
    get: vi.fn(),
    getAll: vi.fn(),
    getIdOf: vi.fn(),
    insert: vi.fn(),
  }
}
