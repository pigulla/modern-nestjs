import { type Mocked, vi } from 'vitest'

import { type IChannelFilterRepository } from './channel-filter.repository.interface.js'

export type ChannelFilterRepositoryMock = Mocked<IChannelFilterRepository>

export function mockChannelFilterRepository(): ChannelFilterRepositoryMock {
  return {
    get: vi.fn(),
    getAll: vi.fn(),
    getForNetwork: vi.fn(),
    getIdOf: vi.fn(),
    insert: vi.fn(),
  }
}
