import type { Constructor } from 'type-fest'
import type { ZodError } from 'zod'

export abstract class ObjectValidationError<T> extends Error {
  public readonly clazz: Constructor<T>
  public readonly cause: ZodError

  protected constructor(clazz: Constructor<T>, cause: ZodError) {
    super(`An instance of class ${clazz.name} failed validation`)

    this.clazz = clazz
    this.cause = cause
  }
}
