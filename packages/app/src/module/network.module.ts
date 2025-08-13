import { Module } from '@nestjs/common'

import { INetworkService } from '#application/network.service.interface.js'
import { NetworkService } from '#application/network.service.js'
import { INetworkRepository } from '#domain/digitally-imported/network.repository.interface.js'
import { NetworkRepository } from '#infrastructure/persistence/network/network.repository.js'
import { NetworkController } from '#presentation/http/network.controller.js'

import { DatabaseModule } from './database.module.js'

@Module({
  imports: [DatabaseModule],
  controllers: [NetworkController],
  providers: [
    {
      provide: INetworkRepository,
      useClass: NetworkRepository,
    },
    {
      provide: INetworkService,
      useClass: NetworkService,
    },
  ],
  exports: [INetworkRepository, INetworkService],
})
export class NetworkModule {}
