import dayjs from 'dayjs'
import { createZodDto } from 'nestjs-zod'
import { z } from 'zod'

import { Quote } from '#domain/quote/quote.js'
import { quoteIdSchema } from '#domain/quote/quote-id.js'

export const createQuoteDTOSchema = z
  .strictObject({
    text: z.string().min(1).max(1000).meta({
      description: 'The text of the quote.',
      example: 'Lorem ipsum dolor sit amet.',
    }),
  })
  .brand<'create-quote-dto'>('create-quote-dto')

export const updateQuoteDTOSchema = createQuoteDTOSchema
  .extend({
    id: quoteIdSchema.meta({
      description: 'The ID of the quote.',
      example: 42,
    }),
  })
  .brand<'update-quote-dto'>('update-quote-dto')

export const quoteDTOSchema = updateQuoteDTOSchema
  .extend({
    createdAt: z.iso
      .datetime({ precision: 3 })
      .transform(value => dayjs(value))
      .refine(value => value.isValid())
      .meta({
        description: 'The time when the quote was created.',
        format: 'date-time',
        example: '2020-01-01T06:15:00.123Z',
      }),
    updatedAt: z.iso
      .datetime({ precision: 3 })
      .transform(value => dayjs(value))
      .refine(value => value.isValid())
      .meta({
        description: 'The time when the quote was last updated.',
        format: 'date-time',
        example: '2020-01-01T06:15:00.123Z',
      }),
  })
  .brand<'quote-dto'>('quote-dto')

export class CreateQuoteDTO extends createZodDto(createQuoteDTOSchema) {}

export class UpdateQuoteDTO extends createZodDto(updateQuoteDTOSchema) {}

export class QuoteDTO extends createZodDto(quoteDTOSchema) {}

export function fromDomain(quote: Quote): QuoteDTO {
  return quoteDTOSchema.parse({
    id: quote.id,
    text: quote.text,
    createdAt: quote.createdAt.toISOString(),
    updatedAt: quote.updatedAt.toISOString(),
  })
}

export function toDomain(quote: QuoteDTO): Quote {
  return new Quote(quote)
}
