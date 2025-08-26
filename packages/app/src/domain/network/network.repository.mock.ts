import { type Mocked, vi } from 'vitest'

import { type INetworkRepository } from './network.repository.interface.js'

export type NetworkRepositoryMock = Mocked<INetworkRepository>

export function mockNetworkRepository(): NetworkRepositoryMock {
  return {
    getByID: vi.fn(),
    getByKey: vi.fn(),
    getAll: vi.fn(),
    insert: vi.fn(),
  }
}
