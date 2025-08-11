import type { FruitID } from '#domain/fruit.js'

export class FruitNotFoundError extends Error {
  public readonly id: FruitID

  public constructor(id: FruitID) {
    super('Fruit not found')

    this.id = id
  }
}
