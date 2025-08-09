import dayjs from 'dayjs'
import { createZodDto } from 'nestjs-zod'
import { z } from 'zod'

import { Author } from '#domain/author/author.js'
import { authorIdSchema } from '#domain/author/author-id.js'

export const createAuthorDTOSchema = z
  .strictObject({
    firstName: z.string().min(1).meta({
      description: 'The first name of the author.',
      example: 'Peter',
    }),
    lastName: z.string().min(1).meta({
      description: 'The last name of the author.',
      example: 'Pan',
    }),
  })
  .brand<'create-author-dto'>('create-author-dto')

export const updateAuthorDTOSchema = createAuthorDTOSchema
  .extend({
    id: authorIdSchema.meta({
      description: 'The ID of the author.',
      example: 42,
    }),
  })
  .brand<'update-author-dto'>('update-author-dto')

export const authorDTOSchema = updateAuthorDTOSchema
  .extend({
    createdAt: z.iso
      .datetime({ precision: 3 })
      .transform(value => dayjs(value))
      .refine(value => value.isValid())
      .meta({
        description: 'The time when the author was created.',
        format: 'date-time',
        example: '2020-01-01T06:15:00.123Z',
      }),
    updatedAt: z.iso
      .datetime({ precision: 3 })
      .transform(value => dayjs(value))
      .refine(value => value.isValid())
      .meta({
        description: 'The time when the author was last updated.',
        format: 'date-time',
        example: '2020-01-01T06:15:00.123Z',
      }),
  })
  .brand<'author-dto'>('author-dto')

export class CreateAuthorDTO extends createZodDto(createAuthorDTOSchema) {}

export class UpdateAuthorDTO extends createZodDto(updateAuthorDTOSchema) {}

export class AuthorDTO extends createZodDto(authorDTOSchema) {}

export function fromDomain(author: Author): AuthorDTO {
  return authorDTOSchema.parse({
    id: author.id,
    firstName: author.firstName,
    lastName: author.lastName,
    createdAt: author.createdAt.toISOString(),
    updatedAt: author.updatedAt.toISOString(),
  })
}

export function toDomain(author: AuthorDTO): Author {
  return new Author(author)
}
