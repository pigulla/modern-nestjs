import { Injectable } from '@nestjs/common'

import type { Fruit } from '#domain/fruit.js'

@Injectable()
export abstract class IFruitService {
  public abstract getRandom(): Fruit
}
