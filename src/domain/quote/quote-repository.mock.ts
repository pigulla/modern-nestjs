import { type Mocked, vi } from 'vitest'

import { type IQuoteRepository } from './quote-repository.interface.js'

export type QuoteRepositoryMock = Mocked<IQuoteRepository>

export function mockQuoteRepository(): QuoteRepositoryMock {
  return {
    create: vi.fn(),
    delete: vi.fn(),
    get: vi.fn(),
    getAll: vi.fn(),
    getRandom: vi.fn(),
    update: vi.fn(),
  }
}
