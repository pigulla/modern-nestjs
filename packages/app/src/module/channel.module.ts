import { Module } from '@nestjs/common'

import { IChannelService } from '#application/channel.service.interface.js'
import { ChannelService } from '#application/channel.service.js'
import { IChannelRepository } from '#domain/digitally-imported/channel.repository.interface.js'
import { ChannelRepository } from '#infrastructure/persistence/channel/channel.repository.js'
import { ChannelController } from '#presentation/http/channel.controller.js'

import { DatabaseModule } from './database.module.js'

@Module({
  imports: [DatabaseModule],
  controllers: [ChannelController],
  providers: [
    {
      provide: IChannelRepository,
      useClass: ChannelRepository,
    },
    {
      provide: IChannelService,
      useClass: ChannelService,
    },
  ],
  exports: [IChannelRepository, IChannelService],
})
export class ChannelModule {}
