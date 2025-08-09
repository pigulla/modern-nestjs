import z from 'zod'

export const quoteIdSchema = z.number().int().min(1).brand<'quote-id'>()

export type QuoteID = z.infer<typeof quoteIdSchema>

export function asQuoteID(id: number): QuoteID {
  return quoteIdSchema.parse(id)
}
