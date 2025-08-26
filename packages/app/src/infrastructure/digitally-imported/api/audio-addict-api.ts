import { Inject, Injectable } from '@nestjs/common'
import { type Got, got } from 'got'
import type { JsonValue } from 'type-fest'

import { Channel } from '#domain/channel/channel.js'
import { ChannelFilter } from '#domain/channel-filter/channel-filter.js'
import { Network, type NetworkID } from '#domain/network/network.js'

import { AUDIO_ADDICT_CONFIG, type AudioAddictConfig } from '../../config/audio-addict.config.js'

import type { IAudioAddictAPI } from './audio-addict-api.interface.js'
import { channelsDtoSchema } from './dto/channel.dto.js'
import { channelFiltersDtoSchema } from './dto/channel-filter.dto.js'
import { networksDtoSchema } from './dto/network.dto.js'

@Injectable()
export class AudioAddictAPI implements IAudioAddictAPI {
  private readonly http: Got

  public constructor(@Inject(AUDIO_ADDICT_CONFIG) config: AudioAddictConfig) {
    this.http = got.extend({
      prefixUrl: config.baseUrl,
    })
  }

  // TODO: Maybe use ETags for local caching?

  public async getNetworks(): Promise<Network[]> {
    const result = await this.http.get('v1/networks').json<JsonValue>()

    return networksDtoSchema
      .parse(result)
      .filter(network => network.active)
      .map(({ id, key, name, url }) =>
        Network.create({
          id,
          key,
          name,
          url,
        }),
      )
  }

  public async getChannels(id: NetworkID): Promise<Channel[]> {
    const result = await this.http.get(`v1/${id}/channels`).json<JsonValue>()

    return channelsDtoSchema
      .parse(result)
      .map(({ id, key, network_id, name, channel_director, description, similar_channels }) =>
        Channel.create({
          id,
          key,
          networkId: network_id,
          name,
          director: channel_director,
          description,
          similar: similar_channels.map(({ similar_channel_id }) => similar_channel_id),
        }),
      )
  }

  public async getChannelFilters(id: NetworkID): Promise<ChannelFilter[]> {
    const result = await this.http.get(`v1/${id}/channel_filters`).json<JsonValue>()

    return channelFiltersDtoSchema
      .parse(result)
      .map(({ id, key, network_id, name, position, channels }) =>
        ChannelFilter.create({
          id,
          key,
          networkId: network_id,
          name,
          position,
          channels,
        }),
      )
  }
}
