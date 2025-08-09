import { Injectable } from '@nestjs/common'

import type { Fruit } from './fruit.js'

@Injectable()
export abstract class IFruitRepository {
  public abstract getAll(): Fruit[]
}
