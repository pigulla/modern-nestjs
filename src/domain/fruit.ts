// biome-ignore lint/correctness/noUndeclaredDependencies: Workaround until https://github.com/biomejs/biome/issues/7162 is fixed.
import type { JsonObject } from 'type-fest'
import z from 'zod'

const fruitSchema = z.strictObject({
  name: z.string().min(1),
  calories: z.number().min(0),
})

export class Fruit {
  // biome-ignore lint/correctness/noUnusedPrivateClassMembers: Disable structural typing.
  readonly #brand = Symbol(Fruit.name)

  public readonly name: string
  public readonly calories: number

  public constructor(data: { name: string; calories: number }) {
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
