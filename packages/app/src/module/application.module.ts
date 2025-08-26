import { Module, Scope } from '@nestjs/common'

import { IChannelService } from '#application/channel.service.interface.js'
import { ChannelService } from '#application/channel.service.js'
import { IChannelFilterService } from '#application/channel-filter.service.interface.js'
import { ChannelFilterService } from '#application/channel-filter.service.js'
import { INetworkService } from '#application/network.service.interface.js'
import { NetworkService } from '#application/network.service.js'
import { IStreamProvider } from '#application/stream-provider.interface.js'
import { IAudioAddictAPI } from '#infrastructure/digitally-imported/api/audio-addict-api.interface.js'
import { AudioAddictAPI } from '#infrastructure/digitally-imported/api/audio-addict-api.js'
import { StaticAudioAddictAPI } from '#infrastructure/digitally-imported/api/static-audio-addict-api.js'
import { DataImporter } from '#infrastructure/digitally-imported/data-importer.js'
import { IIcecastTransformStream } from '#infrastructure/stream/icecast-transform-stream.interface.js'
import { IcecastTransformStream } from '#infrastructure/stream/icecast-transform-stream.js'
import { StreamProvider } from '#infrastructure/stream/stream-provider.js'

import { ConfigModule } from './config.module.js'
import { RepositoryModule } from './repository.module.js'

@Module({
  imports: [RepositoryModule, ConfigModule],
  providers: [
    {
      provide: IAudioAddictAPI,
      useClass: StaticAudioAddictAPI,
    },
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
    {
      provide: IStreamProvider,
      useClass: StreamProvider,
    },
    { provide: IIcecastTransformStream, useClass: IcecastTransformStream, scope: Scope.TRANSIENT },
  ],
  exports: [INetworkService, IChannelService, IChannelFilterService, IStreamProvider],
})
export class ApplicationModule {}
