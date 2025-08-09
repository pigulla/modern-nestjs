import type { Dayjs } from 'dayjs'
import * as dayjs from 'dayjs'
import z from 'zod'

import { Quote } from '#domain/quote/quote.js'
import { quoteIdSchema } from '#domain/quote/quote-id.js'

export const quotesRow = z
  .strictObject({
    id: quoteIdSchema,
    text: z.string(),
    created_at: z.custom<Dayjs>(value => dayjs.isDayjs(value)).refine(value => value.isValid()),
    updated_at: z.custom<Dayjs>(value => dayjs.isDayjs(value)).refine(value => value.isValid()),
  })
  .transform(data => ({
    ...data,
    toDomain: () => {
      const { created_at: createdAt, updated_at: updatedAt, ...other } = data
      return new Quote({ ...other, createdAt, updatedAt })
    },
  }))
  .readonly()
  .brand<'quotes-row'>('quotes-row')

export type QuotesRow = z.infer<typeof quotesRow>
