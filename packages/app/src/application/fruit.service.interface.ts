import type { Fruit, FruitID } from '@modern-nestjs/domain/fruit.js'

import { Injectable } from '@nestjs/common'

@Injectable()
export abstract class IFruitService {
  public abstract get(id: FruitID): Fruit
  public abstract update(fruit: Fruit): Fruit
  public abstract create(fruit: Fruit): Fruit
  public abstract delete(id: FruitID): void
  public abstract getRandom(): Fruit | null
}
