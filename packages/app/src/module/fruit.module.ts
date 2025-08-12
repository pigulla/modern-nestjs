import { Module } from '@nestjs/common'

import { IFruitService } from '#application/fruit.service.interface.js'
import { FruitService } from '#application/fruit.service.js'
import { IFruitRepository } from '#domain/fruit.repository.interface.js'
import { FruitRepository } from '#infrastructure/persistence/fruit.repository.js'
import { FruitController } from '#presentation/http/fruit.controller.js'

@Module({
  controllers: [FruitController],
  providers: [
    { provide: IFruitRepository, useClass: FruitRepository },
    { provide: IFruitService, useClass: FruitService },
  ],
})
export class FruitModule {}
