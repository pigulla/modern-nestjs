import { type Mocked, vi } from 'vitest'

import { type IChannelFilterRepository } from './channel-filter.repository.interface.js'

export type ChannelFilterRepositoryMock = Mocked<IChannelFilterRepository>

export function mockChannelFilterRepository(): ChannelFilterRepositoryMock {
  return {
    get: vi.fn(),
    getAll: vi.fn(),
    getAllForNetwork: vi.fn(),
    insert: vi.fn(),
  }
}
