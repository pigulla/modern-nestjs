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

  public async get(networkKey: NetworkKey, channelKey: ChannelKey): Promise<Channel> {
    const network = await this.networkRepository.getByKey(networkKey)

    return this.channelRepository.getByKeyForNetwork(network.id, channelKey)
  }

  public async getAllForNetwork(networkKey: NetworkKey): Promise<Channel[]> {
    const network = await this.networkRepository.getByKey(networkKey)

    return this.channelRepository.getAllForNetwork(network.id)
  }
}
