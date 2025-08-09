import type { Dayjs } from 'dayjs'
import * as dayjs from 'dayjs'
import z from 'zod'

import { Author } from '#domain/author/author.js'
import { authorIdSchema } from '#domain/author/author-id.js'

export const authorsRow = z
  .strictObject({
    id: authorIdSchema,
    first_name: z.string(),
    last_name: z.string(),
    created_at: z.custom<Dayjs>(value => dayjs.isDayjs(value)).refine(value => value.isValid()),
    updated_at: z.custom<Dayjs>(value => dayjs.isDayjs(value)).refine(value => value.isValid()),
  })
  .transform(data => ({
    ...data,
    toDomain: () => {
      const {
        created_at: createdAt,
        updated_at: updatedAt,
        first_name: firstName,
        last_name: lastName,
        ...other
      } = data
      return new Author({ ...other, firstName, lastName, createdAt, updatedAt })
    },
  }))
  .readonly()
  .brand<'author-row'>('author-row')

export type AuthorsRow = z.infer<typeof authorsRow>
