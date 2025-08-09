import { type Quote } from '#domain/quote/quote.js'
import { type QuoteID } from '#domain/quote/quote-id.js'

export abstract class IQuoteRepository {
  public abstract delete(id: QuoteID): Promise<void>
  public abstract get(id: QuoteID): Promise<Quote>
  public abstract getRandom(): Promise<Quote | null>
  public abstract create(data: { text: string }): Promise<Quote>
  public abstract update(id: QuoteID, data: { text: string }): Promise<Quote>
}
