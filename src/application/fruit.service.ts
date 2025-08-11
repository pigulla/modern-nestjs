import { Injectable, Logger } from '@nestjs/common'

import type { Fruit, FruitID } from '#domain/fruit.js'
import { IFruitRepository } from '#domain/fruit.repository.interface.js'

import { IFruitService } from './fruit.service.interface.js'

@Injectable()
export class FruitService implements IFruitService {
  private readonly logger = new Logger(FruitService.name)
  private readonly repository: IFruitRepository

  public constructor(fruitRepository: IFruitRepository) {
    this.repository = fruitRepository
  }

  public get(id: FruitID): Fruit {
    this.logger.log(`Getting fruit with id "${id}"`)

    return this.repository.get(id)
  }

  public create(fruit: Fruit): Fruit {
    this.logger.log(`Creating a fruit with id "${fruit.id}"`)

    return this.repository.create(fruit)
  }

  public update(fruit: Fruit): Fruit {
    this.logger.log(`Updating fruit with id "${fruit.id}"`)

    return this.repository.update(fruit)
  }

  public delete(id: FruitID): void {
    this.logger.log(`Deleting fruit with id "${id}"`)

    this.repository.delete(id)
  }

  public getRandom(): Fruit | null {
    this.logger.log('Getting a random fruit')

    const fruits = this.repository.getAll()

    return fruits[Math.floor(Math.random() * fruits.length)] ?? null
  }
}
