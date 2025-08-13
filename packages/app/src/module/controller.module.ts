import { Module } from '@nestjs/common'

import { ChannelController } from '#presentation/http/channel.controller.js'
import { NetworkController } from '#presentation/http/network.controller.js'

import { ApplicationModule } from './application.module.js'

@Module({
  imports: [ApplicationModule],
  controllers: [NetworkController, ChannelController],
})
export class ControllerModule {}
