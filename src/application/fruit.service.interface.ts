import { Injectable } from '@nestjs/common'

import type { Fruit, FruitName } from '#domain/fruit.js'

@Injectable()
export abstract class IFruitService {
  public abstract get(name: FruitName): Fruit
  public abstract update(fruit: Fruit): Fruit
  public abstract create(fruit: Fruit): Fruit
  public abstract delete(name: FruitName): void
  public abstract getRandom(): Fruit
}
