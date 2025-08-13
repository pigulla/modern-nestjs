import { Module } from '@nestjs/common'

import { IChannelFilterService } from '#application/channel-filter.service.interface.js'
import { ChannelFilterService } from '#application/channel-filter.service.js'
import { IChannelFilterRepository } from '#domain/digitally-imported/channel-filter.repository.interface.js'
import { ChannelFilterRepository } from '#infrastructure/persistence/channel-filter/channel-filter.repository.js'
import { ChannelFilterController } from '#presentation/http/channel-filter.controller.js'

import { DatabaseModule } from './database.module.js'

@Module({
  imports: [DatabaseModule],
  controllers: [ChannelFilterController],
  providers: [
    {
      provide: IChannelFilterRepository,
      useClass: ChannelFilterRepository,
    },
    {
      provide: IChannelFilterService,
      useClass: ChannelFilterService,
    },
  ],
  exports: [IChannelFilterRepository, IChannelFilterService],
})
export class ChannelFilterModule {}
