import { Injectable, Logger } from '@nestjs/common'

import type { Fruit } from '#domain/fruit.js'
import { IFruitRepository } from '#domain/fruit.repository.interface.js'

import { IFruitService } from './fruit.service.interface.js'

@Injectable()
export class FruitService implements IFruitService {
  private readonly logger = new Logger(FruitService.name)
  private readonly fruitRepository: IFruitRepository

  public constructor(fruitRepository: IFruitRepository) {
    this.fruitRepository = fruitRepository
  }

  public getRandom(): Fruit {
    this.logger.log('Returning a random fruit')

    const fruits = this.fruitRepository.getAll()

    return fruits[Math.floor(Math.random() * fruits.length)]
  }
}
