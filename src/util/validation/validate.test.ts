import { describe, expect, it } from 'vitest'
import z, { ZodError } from 'zod'

import { ObjectValidationError } from './object-validation.error.js'
import { validate } from './validate.js'

describe('validate', () => {
  const schema = z.strictObject({ foo: z.literal('bar'), bam: z.string().default('baz') })

  it('should return the parsed value', () => {
    expect(validate(schema, { foo: 'bar' })).toEqual({ foo: 'bar', bam: 'baz' })
  })

  it('should throw the specified', () => {
    class Entity {}

    class MyError extends ObjectValidationError<Entity> {
      public constructor(error: ZodError) {
        super(Entity, error)
      }
    }

    expect(() => validate(schema, {}, MyError)).to.throw(MyError)
  })

  it('should throw an error', () => {
    expect(() => validate(schema, {})).to.throw()
  })
})
