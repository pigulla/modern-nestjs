import { Module } from '@nestjs/common'

import { IChannelService } from '#application/channel.service.interface.js'
import { ChannelService } from '#application/channel.service.js'
import { IChannelFilterService } from '#application/channel-filter.service.interface.js'
import { ChannelFilterService } from '#application/channel-filter.service.js'
import { INetworkService } from '#application/network.service.interface.js'
import { NetworkService } from '#application/network.service.js'
import { DataImporter } from '#infrastructure/digitally-imported/data-importer.js'

import { RepositoryModule } from './repository.module.js'

@Module({
  imports: [RepositoryModule],
  providers: [
    DataImporter,
    {
      provide: INetworkService,
      useClass: NetworkService,
    },
    {
      provide: IChannelService,
      useClass: ChannelService,
    },
    {
      provide: IChannelFilterService,
      useClass: ChannelFilterService,
    },
  ],
  exports: [INetworkService, IChannelService, IChannelFilterService],
})
export class ApplicationModule {}
