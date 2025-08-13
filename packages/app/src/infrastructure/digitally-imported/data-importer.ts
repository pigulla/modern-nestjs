import * as net from 'node:net'

import { Injectable, Logger, type OnModuleInit } from '@nestjs/common'
import type { Writable } from 'type-fest'

import { Channel, type ChannelKey } from '#domain/channel/channel.js'
import { IChannelRepository } from '#domain/channel/channel.repository.interface.js'
import { ChannelFilter, type ChannelFilterKey } from '#domain/channel-filter/channel-filter.js'
import { IChannelFilterRepository } from '#domain/channel-filter/channel-filter.repository.interface.js'
import { Network, type NetworkKey } from '#domain/network/network.js'
import { INetworkRepository } from '#domain/network/network.repository.interface.js'

import data from '../../../../../data.json' with { type: 'json' }

type NetworkMap = ReadonlyMap<number, NetworkKey>
type ChannelMap = ReadonlyMap<number, ChannelKey>
type ChannelFilterMap = ReadonlyMap<number, ChannelFilterKey>

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
    const networks = await this.loadNetworks()
    const channels = await this.loadChannels(networks)
    await this.loadChannelFilters(networks, channels)
  }

  private async loadNetworks(): Promise<NetworkMap> {
    const result = new Map() as Writable<NetworkMap>

    for (const item of data.networks) {
      if (!item.active) {
        continue
      }

      const network = await this.networkRepository.insert(
        Network.create({
          key: item.key,
          name: item.name,
          url: item.url,
        }),
      )

      result.set(item.id, network.key)
    }

    this.logger.verbose(`Successfully loaded ${result.size} network(s)`)
    return result
  }

  private async loadChannels(networks: NetworkMap): Promise<ChannelMap> {
    const result = new Map() as Writable<ChannelMap>

    for (const item of data.channels) {
      const channel = await this.channelRepository.insert(
        Channel.create({
          key: item.key,
          // biome-ignore lint/style/noNonNullAssertion: If this explodes, it should do so loudly.
          networkKey: networks.get(item.network_id)!,
          name: item.name,
          description: item.description,
          director: item.channel_director,
          similarChannels: [],
        }),
      )

      result.set(item.id, channel.key)
    }

    this.logger.verbose(`Successfully loaded ${result.size} channels(s)`)
    return result
  }

  private async loadChannelFilters(
    networks: NetworkMap,
    channels: ChannelMap,
  ): Promise<ChannelFilterMap> {
    const result = new Map() as Writable<ChannelFilterMap>

    for (const item of data.channel_filters) {
      const channelFilter = await this.channelFilterRepository.insert(
        ChannelFilter.create({
          key: item.key,
          // biome-ignore lint/style/noNonNullAssertion: If this explodes, it should do so loudly.
          networkKey: networks.get(item.network_id)!,
          name: item.name,
          position: item.position,
          // biome-ignore lint/style/noNonNullAssertion: If this explodes, it should do so loudly.
          channels: item.channels.map(id => channels.get(id)!),
        }),
      )

      result.set(item.id, channelFilter.key)
    }

    this.logger.verbose(`Successfully loaded ${result.size} channel filter(s)`)
    return result
  }
}
