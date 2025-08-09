import type { Dayjs } from 'dayjs'
import * as dayjs from 'dayjs'
import z from 'zod'

import type { JsonValue } from '#util/json.js'
import { validate } from '#util/validation/validate.js'

import { InvalidQuoteError } from './invalid-quote.error.js'
import { type QuoteID, quoteIdSchema } from './quote-id.js'

const quoteSchema = z.strictObject({
  id: quoteIdSchema,
  text: z.string().min(1).max(1000),
  createdAt: z.custom<Dayjs>(value => dayjs.isDayjs(value)).refine(value => value.isValid()),
  updatedAt: z.custom<Dayjs>(value => dayjs.isDayjs(value)).refine(value => value.isValid()),
})

export class Quote {
  // biome-ignore lint/correctness/noUnusedPrivateClassMembers: Disable structural typing.
  readonly #brand = Symbol(Quote.name)

  public readonly id: QuoteID
  public readonly text: string
  public readonly createdAt: Dayjs
  public readonly updatedAt: Dayjs

  public constructor(data: { id: QuoteID; text: string; createdAt: Dayjs; updatedAt: Dayjs }) {
    const { id, text, createdAt, updatedAt } = validate(quoteSchema, data, InvalidQuoteError)

    this.id = id
    this.text = text
    this.createdAt = createdAt
    this.updatedAt = updatedAt
  }

  public toJSON(): JsonValue {
    return {
      id: this.id,
      text: this.text,
      createdAt: this.createdAt.toISOString(),
      updatedAt: this.updatedAt.toISOString(),
    }
  }
}
