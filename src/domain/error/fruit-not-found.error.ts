import type { FruitName } from '#domain/fruit.js'

export class FruitNotFoundError extends Error {
  public readonly name: FruitName

  public constructor(name: FruitName) {
    super('Fruit not found')

    this.name = name
  }
}
