import { Injectable, Logger } from '@nestjs/common'

import type { Fruit, FruitName } from '#domain/fruit.js'
import { IFruitRepository } from '#domain/fruit.repository.interface.js'

import { IFruitService } from './fruit.service.interface.js'

@Injectable()
export class FruitService implements IFruitService {
  private readonly logger = new Logger(FruitService.name)
  private readonly repository: IFruitRepository

  public constructor(fruitRepository: IFruitRepository) {
    this.repository = fruitRepository
  }

  public get(name: FruitName): Fruit {
    this.logger.log(`Getting fruit with name "${name}"`)

    return this.repository.get(name)
  }

  public create(fruit: Fruit): Fruit {
    this.logger.log(`Creating a fruit with name "${fruit.name}"`)

    return this.repository.create(fruit)
  }

  public update(fruit: Fruit): Fruit {
    this.logger.log(`Updating fruit with name "${fruit.name}"`)

    return this.repository.update(fruit)
  }

  public delete(name: FruitName): void {
    this.logger.log(`Deleting fruit with name "${name}"`)

    this.repository.delete(name)
  }

  public getRandom(): Fruit {
    this.logger.log('Getting a random fruit')

    const fruits = this.repository.getAll()

    return fruits[Math.floor(Math.random() * fruits.length)]
  }
}
