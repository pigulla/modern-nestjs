import { Channel } from '#domain/channel/channel.js'
import { ChannelFilter } from '#domain/channel-filter/channel-filter.js'
import { Network } from '#domain/network/network.js'

import { Injectable, Logger, type OnModuleInit } from '@nestjs/common'

import { IChannelRepository } from '#domain/channel/channel.repository.interface.js'
import { IChannelFilterRepository } from '#domain/channel-filter/channel-filter.repository.interface.js'
import { INetworkRepository } from '#domain/network/network.repository.interface.js'

import data from '../../../../../data.json' with { type: 'json' }

@Injectable()
export class DataImporter implements OnModuleInit {
  private readonly logger = new Logger(DataImporter.name)
  private readonly networkRepository: INetworkRepository
  private readonly channelRepository: IChannelRepository
  private readonly channelFilterRepository: IChannelFilterRepository

  public constructor(
    networkRepository: INetworkRepository,
    channelRepository: IChannelRepository,
    channelFilterRepository: IChannelFilterRepository,
  ) {
    this.networkRepository = networkRepository
    this.channelRepository = channelRepository
    this.channelFilterRepository = channelFilterRepository
  }

  public async onModuleInit(): Promise<void> {
    await this.loadNetworks()
    await this.loadChannels()
    await this.loadChannelFilters()
  }

  private async loadNetworks(): Promise<void> {
    let count = 0

    for (const network of data.networks) {
      if (!network.active) {
        continue
      }

      count++
      await this.networkRepository.insert(
        Network.create({
          id: network.id,
          key: network.key,
          name: network.name,
          url: network.url,
        }),
      )
    }

    this.logger.verbose(`Successfully loaded ${count} network(s)`)
  }

  private async loadChannels(): Promise<void> {
    let count = 0

    for (const channel of data.channels) {
      count++
      await this.channelRepository.insert(
        Channel.create({
          id: channel.id,
          key: channel.key,
          network: channel.network_id,
          name: channel.name,
          description: channel.description,
          director: channel.channel_director,
          similarChannels: [],
        }),
      )
    }

    this.logger.verbose(`Successfully loaded ${count} channels(s)`)
  }

  private async loadChannelFilters(): Promise<void> {
    let count = 0

    for (const channelFilter of data.channel_filters) {
      count++
      await this.channelFilterRepository.insert(
        ChannelFilter.create({
          id: channelFilter.id,
          key: channelFilter.key,
          network: channelFilter.network_id,
          name: channelFilter.name,
          position: channelFilter.position,
          channels: channelFilter.channels,
        }),
      )
    }

    this.logger.verbose(`Successfully loaded ${count} channel filter(s)`)
  }
}
