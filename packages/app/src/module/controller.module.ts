import { Module } from '@nestjs/common'

import { NetworkController } from '#presentation/http/network.controller.js'
import { StreamController } from '#presentation/http/stream.controller.js'

import { ApplicationModule } from './application.module.js'

@Module({
  imports: [ApplicationModule],
  controllers: [NetworkController, StreamController],
})
export class ControllerModule {}
