// biome-ignore lint/correctness/noUndeclaredDependencies: Workaround until https://github.com/biomejs/biome/issues/7162 is fixed.
import type { JsonObject } from 'type-fest'
import z from 'zod'

export const fruitIdSchema = z
  .number()
  .int()
  .min(1)
  .meta({ description: 'The id of the fruit.' })
  .brand('fruit-id')

export type FruitID = z.infer<typeof fruitIdSchema>

export function asFruitID(value: number): FruitID {
  return fruitIdSchema.parse(value)
}

const fruitSchema = z.strictObject({
  id: fruitIdSchema,
  name: z.string().min(1).meta({ description: 'The name of the fruit.' }),
  calories: z.number().min(0).meta({ description: 'How much calories a serving has.' }),
})

export class Fruit {
  // biome-ignore lint/correctness/noUnusedPrivateClassMembers: Disable structural typing.
  readonly #brand = Symbol(Fruit.name)

  public readonly id: FruitID
  public readonly name: string
  public readonly calories: number

  public constructor(data: { id: FruitID; name: string; calories: number }) {
    const { id, name, calories } = fruitSchema.parse(data)

    this.id = id
    this.name = name
    this.calories = calories
  }

  // This is an alternative, more user-friendly way to construct an instance that takes care of annoying type casts and
  // conversions. It's basically just syntactic sugar.
  public static create({
    id,
    name,
    calories,
  }: {
    id: number
    name: string
    calories: number
  }): Fruit {
    return new Fruit({
      id: asFruitID(id),
      name,
      calories,
    })
  }

  public toJSON(): JsonObject {
    return {
      id: this.id,
      name: this.name,
      calories: this.calories,
    }
  }
}
