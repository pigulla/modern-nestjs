import type { AuthorID } from '#domain/author/author-id.js'

import { type Quote } from './quote.js'
import { type QuoteID } from './quote-id.js'

export abstract class IQuoteRepository {
  public abstract delete(id: QuoteID): Promise<void>
  public abstract get(id: QuoteID): Promise<Quote>
  public abstract getAll(): Promise<Quote[]>
  public abstract getRandom(): Promise<Quote | null>
  public abstract create(data: { text: string; authorId: AuthorID }): Promise<Quote>
  public abstract update(id: QuoteID, data: { text: string; authorId: AuthorID }): Promise<Quote>
}
