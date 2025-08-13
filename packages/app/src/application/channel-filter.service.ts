import type { ChannelFilter, ChannelFilterKey } from '@di/domain/channel-filter.js'
import type { NetworkKey } from '@di/domain/network.js'

import { Injectable } from '@nestjs/common'

import { IChannelFilterRepository } from '#domain/channel-filter/channel-filter.repository.interface.js'
import { INetworkRepository } from '#domain/network/network.repository.interface.js'

import type { IChannelFilterService } from './channel-filter.service.interface.js'

@Injectable()
export class ChannelFilterService implements IChannelFilterService {
  private readonly channelFilterRepository: IChannelFilterRepository
  private readonly networkRepository: INetworkRepository

  public constructor(
    channelFilterRepository: IChannelFilterRepository,
    networkRepository: INetworkRepository,
  ) {
    this.channelFilterRepository = channelFilterRepository
    this.networkRepository = networkRepository
  }

  public async get(key: ChannelFilterKey): Promise<ChannelFilter> {
    const id = await this.channelFilterRepository.getIdOf(key)
    return this.channelFilterRepository.get(id)
  }

  public getAll(): Promise<ChannelFilter[]> {
    return this.channelFilterRepository.getAll()
  }

  public async getAllForNetwork(key: NetworkKey): Promise<ChannelFilter[]> {
    const id = await this.networkRepository.getIdOf(key)

    return this.channelFilterRepository.getAllForNetwork(id)
  }
}
