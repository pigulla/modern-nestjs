import { type ZodError } from 'zod'

import { ObjectValidationError } from '#util/validation/object-validation.error.js'

import { Author } from './author.js'

export class InvalidAuthorError extends ObjectValidationError<Author> {
  public constructor(cause: ZodError) {
    super(Author, cause)
  }
}
