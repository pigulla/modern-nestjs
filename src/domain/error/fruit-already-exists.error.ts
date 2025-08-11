import type { FruitID } from '#domain/fruit.js'

export class FruitAlreadyExistsError extends Error {
  public readonly id: FruitID

  public constructor(id: FruitID) {
    super('A fruit with the given id already exists')

    this.id = id
  }
}
