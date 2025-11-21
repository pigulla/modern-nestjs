import type { Dayjs } from 'dayjs'
import * as dayjs from 'dayjs'
import type { JsonObject } from 'type-fest'
import z from 'zod'

import { validate } from '#util/validation/validate.js'

import { type AuthorID, authorIdSchema } from './author-id.js'
import { InvalidAuthorError } from './invalid-author.error.js'

const authorSchema = z.strictObject({
  id: authorIdSchema,
  firstName: z.string().min(1),
  lastName: z.string().min(1),
  createdAt: z.custom<Dayjs>(value => dayjs.isDayjs(value)).refine(value => value.isValid()),
  updatedAt: z.custom<Dayjs>(value => dayjs.isDayjs(value)).refine(value => value.isValid()),
})

export class Author {
  // biome-ignore lint/correctness/noUnusedPrivateClassMembers: Disable structural typing.
  readonly #brand = Symbol(Author.name)

  public readonly id: AuthorID
  public readonly firstName: string
  public readonly lastName: string
  public readonly createdAt: Dayjs
  public readonly updatedAt: Dayjs

  public constructor(data: {
    id: AuthorID
    firstName: string
    lastName: string
    createdAt: Dayjs
    updatedAt: Dayjs
  }) {
    const { id, firstName, lastName, createdAt, updatedAt } = validate(
      authorSchema,
      data,
      InvalidAuthorError,
    )

    this.id = id
    this.firstName = firstName
    this.lastName = lastName
    this.createdAt = createdAt
    this.updatedAt = updatedAt
  }

  public toJSON(): JsonObject {
    return {
      id: this.id,
      firstName: this.firstName,
      lastName: this.lastName,
      createdAt: this.createdAt.toISOString(),
      updatedAt: this.updatedAt.toISOString(),
    }
  }
}
