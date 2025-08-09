import { Module } from '@nestjs/common'

import { ConfigModule } from './config.module.js'
import { FruitModule } from './fruit.module.js'
import { LoggingModule } from './logging.module.js'

@Module({
  imports: [ConfigModule, LoggingModule, FruitModule],
  exports: [ConfigModule],
})
export class MainModule {}
