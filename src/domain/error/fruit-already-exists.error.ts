import type { FruitName } from '#domain/fruit.js'

export class FruitAlreadyExistsError extends Error {
  public readonly name: FruitName

  public constructor(name: FruitName) {
    super('A fruit with the given name already exists')

    this.name = name
  }
}
