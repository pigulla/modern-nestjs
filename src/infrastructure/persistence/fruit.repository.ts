import { Injectable } from '@nestjs/common'

import { FruitAlreadyExistsError } from '#domain/error/fruit-already-exists.error.js'
import { FruitNotFoundError } from '#domain/error/fruit-not-found.error.js'
import { asFruitName, Fruit, type FruitName } from '#domain/fruit.js'
import type { IFruitRepository } from '#domain/fruit.repository.interface.js'

@Injectable()
export class FruitRepository implements IFruitRepository {
  private readonly fruits: Map<FruitName, Fruit> = new Map([
    [asFruitName('Banana'), new Fruit({ name: asFruitName('Banana'), calories: 111 })],
    [asFruitName('Pear'), new Fruit({ name: asFruitName('Pear'), calories: 103 })],
    [asFruitName('Plum'), new Fruit({ name: asFruitName('Plum'), calories: 17 })],
  ])

  public create(fruit: Fruit): Fruit {
    if (this.fruits.has(fruit.name)) {
      throw new FruitAlreadyExistsError(fruit.name)
    }

    this.fruits.set(fruit.name, fruit)

    return fruit
  }

  public get(name: FruitName): Fruit {
    const fruit = this.fruits.get(name)

    if (!fruit) {
      throw new FruitNotFoundError(name)
    }

    return fruit
  }

  public getAll(): Fruit[] {
    return [...this.fruits.values()]
  }

  public delete(name: FruitName): void {
    if (!this.fruits.has(name)) {
      throw new FruitNotFoundError(name)
    }

    this.fruits.delete(name)
  }

  public update(fruit: Fruit): Fruit {
    if (!this.fruits.has(fruit.name)) {
      throw new FruitNotFoundError(fruit.name)
    }

    this.fruits.set(fruit.name, fruit)

    return fruit
  }
}
