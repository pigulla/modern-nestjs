import type { Dayjs } from 'dayjs'
import * as dayjs from 'dayjs'
import type { JsonObject } from 'type-fest'
import z from 'zod'

import { validate } from '#util/validation/validate.js'

import { type AuthorID, authorIdSchema } from '../author/author-id.js'

import { InvalidQuoteError } from './invalid-quote.error.js'
import { type QuoteID, quoteIdSchema } from './quote-id.js'

const quoteSchema = z.strictObject({
  id: quoteIdSchema,
  text: z.string().min(1).max(1000),
  authorId: authorIdSchema,
  createdAt: z.custom<Dayjs>(value => dayjs.isDayjs(value)).refine(value => value.isValid()),
  updatedAt: z.custom<Dayjs>(value => dayjs.isDayjs(value)).refine(value => value.isValid()),
})

export class Quote {
  // biome-ignore lint/correctness/noUnusedPrivateClassMembers: Disable structural typing.
  readonly #brand = Symbol(Quote.name)

  public readonly id: QuoteID
  public readonly text: string
  public readonly authorId: AuthorID
  public readonly createdAt: Dayjs
  public readonly updatedAt: Dayjs

  public constructor(data: {
    id: QuoteID
    text: string
    authorId: AuthorID
    createdAt: Dayjs
    updatedAt: Dayjs
  }) {
    const { id, text, authorId, createdAt, updatedAt } = validate(
      quoteSchema,
      data,
      InvalidQuoteError,
    )

    this.id = id
    this.text = text
    this.authorId = authorId
    this.createdAt = createdAt
    this.updatedAt = updatedAt
  }

  public toJSON(): JsonObject {
    return {
      id: this.id,
      text: this.text,
      authorId: this.authorId,
      createdAt: this.createdAt.toISOString(),
      updatedAt: this.updatedAt.toISOString(),
    }
  }
}
