import { Injectable } from '@nestjs/common'

import type { ChannelFilter, ChannelFilterKey } from '#domain/channel-filter/channel-filter.js'
import { IChannelFilterRepository } from '#domain/channel-filter/channel-filter.repository.interface.js'
import type { NetworkKey } from '#domain/network/network.js'
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

  public async get(
    networkKey: NetworkKey,
    channelFilterKey: ChannelFilterKey,
  ): Promise<ChannelFilter> {
    const network = await this.networkRepository.getByKey(networkKey)
    return this.channelFilterRepository.getByKeyForNetwork(network.id, channelFilterKey)
  }

  public getAll(): Promise<ChannelFilter[]> {
    return this.channelFilterRepository.getAll()
  }

  public async getAllForNetwork(networkKey: NetworkKey): Promise<ChannelFilter[]> {
    const network = await this.networkRepository.getByKey(networkKey)
    return this.channelFilterRepository.getAllForNetwork(network.id)
  }
}
