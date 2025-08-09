import type { Constructor } from 'type-fest'
import type { output, ZodError, ZodSchema } from 'zod'

import type { ObjectValidationError } from './object-validation.error.js'

export function validate<
  T extends ZodSchema,
  S extends Constructor<ObjectValidationError<unknown>, [ZodError]>,
>(schema: T, value: unknown, ErrorClass?: S): output<T> {
  const result = schema.safeParse(value)

  if (result.success) {
    return result.data
  }

  throw ErrorClass ? new ErrorClass(result.error) : result.error
}
