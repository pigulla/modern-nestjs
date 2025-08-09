import { type ZodError } from 'zod'

import { ObjectValidationError } from '#util/validation/object-validation.error.js'

import { Quote } from './quote.js'

export class InvalidQuoteError extends ObjectValidationError<Quote> {
  public constructor(cause: ZodError) {
    super(Quote, cause)
  }
}
