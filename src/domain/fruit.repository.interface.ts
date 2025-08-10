import { Injectable } from '@nestjs/common'

import type { Fruit, FruitName } from './fruit.js'

@Injectable()
export abstract class IFruitRepository {
  public abstract create(fruit: Fruit): Fruit
  public abstract get(name: FruitName): Fruit
  public abstract getAll(): Fruit[]
  public abstract delete(name: FruitName): void
  public abstract update(fruit: Fruit): Fruit
}
