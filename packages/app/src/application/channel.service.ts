import { Channel, type ChannelKey } from '#domain/channel/channel.js'
import type { NetworkKey } from '#domain/network/network.js'

import { Injectable } from '@nestjs/common'

import { IChannelRepository } from '#domain/channel/channel.repository.interface.js'
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

  public async get(key: ChannelKey): Promise<Channel> {
    const id = await this.channelRepository.getIdOf(key)
    return this.channelRepository.get(id)
  }

  public getAll(): Promise<Channel[]> {
    return this.channelRepository.getAll()
  }

  public async getAllForNetwork(key: NetworkKey): Promise<Channel[]> {
    const id = await this.networkRepository.getIdOf(key)

    return this.channelRepository.getAllForNetwork(id)
  }
}
