import { Injectable, Logger, type OnModuleInit } from '@nestjs/common'

import { Channel, type ChannelID } from '#domain/channel/channel.js'
import { IChannelRepository } from '#domain/channel/channel.repository.interface.js'
import { ChannelFilter } from '#domain/channel-filter/channel-filter.js'
import { IChannelFilterRepository } from '#domain/channel-filter/channel-filter.repository.interface.js'
import { Network, type NetworkID } from '#domain/network/network.js'
import { INetworkRepository } from '#domain/network/network.repository.interface.js'

import { IAudioAddictAPI } from './api/audio-addict-api.interface.js'

@Injectable()
export class DataImporter implements OnModuleInit {
  private readonly logger = new Logger(DataImporter.name)
  private readonly audioAddictApi: IAudioAddictAPI
  private readonly networkRepository: INetworkRepository
  private readonly channelRepository: IChannelRepository
  private readonly channelFilterRepository: IChannelFilterRepository

  public constructor(
    audioAddictApi: IAudioAddictAPI,
    networkRepository: INetworkRepository,
    channelRepository: IChannelRepository,
    channelFilterRepository: IChannelFilterRepository,
  ) {
    this.audioAddictApi = audioAddictApi
    this.networkRepository = networkRepository
    this.channelRepository = channelRepository
    this.channelFilterRepository = channelFilterRepository
  }

  public async onModuleInit(): Promise<void> {
    const networks = await this.loadNetworks()
    await this.loadChannels(networks)
    await this.loadChannelFilters(networks)
  }

  private async loadNetworks(): Promise<Network[]> {
    const networks = await this.audioAddictApi.getNetworks()
    const result: Network[] = []

    for (const item of networks) {
      const network = Network.create({
        id: item.id,
        key: item.key,
        name: item.name,
        url: item.url,
      })
      result.push(network)

      await this.networkRepository.insert(network)
    }

    this.logger.log(`Successfully loaded ${result.length} network(s)`)
    return result
  }

  private async loadChannels(networks: Network[]): Promise<void> {
    const channelsByNetwork: ReadonlyMap<Network, Channel[]> = new Map(
      await Promise.all(
        networks.map(
          async network => [network, await this.audioAddictApi.getChannels(network.id)] as const,
        ),
      ),
    )

    for (const [{ id, name }, channels] of channelsByNetwork) {
      for (const item of channels) {
        const channel = Channel.create({
          id: item.id,
          key: item.key,
          networkId: id,
          name: item.name,
          description: item.description,
          director: item.director,
          similar: item.similar,
        })
        await this.channelRepository.insert(channel)
      }

      this.logger.log(
        `Successfully loaded ${channels.length} channel(s) for network "${name}" (id=${id})`,
      )
    }
  }

  private async loadChannelFilters(networks: Network[]): Promise<void> {
    const channelFiltersByNetwork: ReadonlyMap<Network, ChannelFilter[]> = new Map(
      await Promise.all(
        networks.map(
          async network =>
            [network, await this.audioAddictApi.getChannelFilters(network.id)] as const,
        ),
      ),
    )

    for (const [{ id, name }, channelFilters] of channelFiltersByNetwork) {
      for (const item of channelFilters) {
        const channelFilter = ChannelFilter.create({
          id: item.id,
          key: item.key,
          networkId: id,
          name: item.name,
          position: item.position,
          channels: item.channels,
        })
        await this.channelFilterRepository.insert(channelFilter)
      }

      this.logger.log(
        `Successfully loaded ${channelFilters.length} channel filter(s) for network "${name}" (id=${id})`,
      )
    }
  }
}
