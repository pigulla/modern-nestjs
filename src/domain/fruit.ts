// biome-ignore lint/correctness/noUndeclaredDependencies: Workaround until https://github.com/biomejs/biome/issues/7162 is fixed.
import type { JsonObject } from 'type-fest'
import z from 'zod'

export const fruitNameSchema = z
  .string()
  .min(1)
  .refine(value => value !== 'random', { message: '"random" is a reserved name' })
  .brand('fruit-name')

export type FruitName = z.infer<typeof fruitNameSchema>

export function asFruitName(value: string): FruitName {
  return fruitNameSchema.parse(value)
}

const fruitSchema = z.strictObject({
  name: fruitNameSchema,
  calories: z.number().min(0),
})

export class Fruit {
  // biome-ignore lint/correctness/noUnusedPrivateClassMembers: Disable structural typing.
  readonly #brand = Symbol(Fruit.name)

  public readonly name: FruitName
  public readonly calories: number

  public constructor(data: { name: FruitName; calories: number }) {
    const { name, calories } = fruitSchema.parse(data)

    this.name = name
    this.calories = calories
  }

  public toJSON(): JsonObject {
    return {
      name: this.name,
      calories: this.calories,
    }
  }
}
