import { type QuoteID } from './quote-id.js'

export class QuoteNotFoundError extends Error {
  public readonly id: QuoteID

  public constructor(id: QuoteID) {
    super('Quote not found')

    this.id = id
  }
}
