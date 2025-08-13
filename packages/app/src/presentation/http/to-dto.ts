import { ChannelDTO, channelDtoSchema } from '@di/dto/channel.dto.js'
import { ChannelFilterDTO, channelFilterDtoSchema } from '@di/dto/channel-filter.dto.js'
import { NetworkDTO, networkDtoSchema } from '@di/dto/network.dto.js'

import type { Channel } from '#domain/channel/channel.js'
import type { ChannelFilter } from '#domain/channel-filter/channel-filter.js'
import type { Network } from '#domain/network/network.js'

export function channelToDTO(channel: Channel): ChannelDTO {
  return channelDtoSchema.parse({
    key: channel.key,
    name: channel.name,
    director: channel.director,
    description: channel.description,
  })
}

export function channelFilterToDTO(channelFilter: ChannelFilter): ChannelFilterDTO {
  return channelFilterDtoSchema.parse({
    key: channelFilter.key,
    network: channelFilter.network,
    name: channelFilter.name,
    position: channelFilter.position,
    channels: [...channelFilter.channels],
  })
}

export function networkToDTO(network: Network): NetworkDTO {
  return networkDtoSchema.parse({
    key: network.key,
    name: network.name,
    url: network.url,
  })
}
