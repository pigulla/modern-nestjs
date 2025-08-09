import { Injectable } from '@nestjs/common'

import { Fruit } from '#domain/fruit.js'
import type { IFruitRepository } from '#domain/fruit.repository.interface.js'

@Injectable()
export class FruitRepository implements IFruitRepository {
  private readonly fruits: readonly Fruit[] = [
    new Fruit({ name: 'Banana', calories: 111 }),
    new Fruit({ name: 'Pear', calories: 103 }),
    new Fruit({ name: 'Plum', calories: 17 }),
  ]

  public getAll(): Fruit[] {
    return [...this.fruits]
  }
}
