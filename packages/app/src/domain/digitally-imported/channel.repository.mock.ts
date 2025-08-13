import { type Mocked, vi } from 'vitest'

import { type IChannelRepository } from './channel.repository.interface.js'

export type ChannelRepositoryMock = Mocked<IChannelRepository>

export function mockChannelRepository(): ChannelRepositoryMock {
  return {
    get: vi.fn(),
    getAll: vi.fn(),
    insert: vi.fn(),
  }
}
