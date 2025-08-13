import { Module } from '@nestjs/common'

import { ChannelController } from '#presentation/http/channel.controller.js'
import { ChannelFilterController } from '#presentation/http/channel-filter.controller.js'
import { NetworkController } from '#presentation/http/network.controller.js'

import { ApplicationModule } from './application.module.js'

@Module({
  imports: [ApplicationModule],
  controllers: [NetworkController, ChannelController, ChannelFilterController],
})
export class ControllerModule {}
