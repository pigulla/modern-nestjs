import { Injectable } from '@nestjs/common'

import { FruitAlreadyExistsError } from '#domain/error/fruit-already-exists.error.js'
import { FruitNotFoundError } from '#domain/error/fruit-not-found.error.js'
import { asFruitID, Fruit, type FruitID } from '#domain/fruit.js'
import type { IFruitRepository } from '#domain/fruit.repository.interface.js'

@Injectable()
export class FruitRepository implements IFruitRepository {
  private readonly fruits: Map<FruitID, Fruit> = new Map([
    [asFruitID(1), new Fruit({ id: asFruitID(1), name: 'Banana', calories: 111 })],
    [asFruitID(2), new Fruit({ id: asFruitID(2), name: 'Pear', calories: 103 })],
    [asFruitID(3), new Fruit({ id: asFruitID(3), name: 'Plum', calories: 17 })],
  ])

  public create(fruit: Fruit): Fruit {
    if (this.fruits.has(fruit.id)) {
      throw new FruitAlreadyExistsError(fruit.id)
    }

    this.fruits.set(fruit.id, fruit)

    return fruit
  }

  public get(id: FruitID): Fruit {
    const fruit = this.fruits.get(id)

    if (!fruit) {
      throw new FruitNotFoundError(id)
    }

    return fruit
  }

  public getAll(): Fruit[] {
    return [...this.fruits.values()]
  }

  public delete(id: FruitID): void {
    if (!this.fruits.has(id)) {
      throw new FruitNotFoundError(id)
    }

    this.fruits.delete(id)
  }

  public update(fruit: Fruit): Fruit {
    if (!this.fruits.has(fruit.id)) {
      throw new FruitNotFoundError(fruit.id)
    }

    this.fruits.set(fruit.id, fruit)

    return fruit
  }
}
