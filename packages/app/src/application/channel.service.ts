import { Injectable } from '@nestjs/common'

import { Channel, type ChannelKey } from '#domain/channel/channel.js'
import { IChannelRepository } from '#domain/channel/channel.repository.interface.js'
import type { NetworkKey } from '#domain/network/network.js'
import { INetworkRepository } from '#domain/network/network.repository.interface.js'

import type { IChannelService } from './channel.service.interface.js'

@Injectable()
export class ChannelService implements IChannelService {
  private readonly channelRepository: IChannelRepository
  private readonly networkRepository: INetworkRepository

  public constructor(channelRepository: IChannelRepository, networkRepository: INetworkRepository) {
    this.channelRepository = channelRepository
    this.networkRepository = networkRepository
  }

  public get(key: ChannelKey): Promise<Channel> {
    return this.channelRepository.get(key)
  }

  public getAll(): Promise<Channel[]> {
    return this.channelRepository.getAll()
  }

  public async getAllForNetwork(key: NetworkKey): Promise<Channel[]> {
    const network = await this.networkRepository.get(key)
    return this.channelRepository.getAllForNetwork(network.key)
  }
}
