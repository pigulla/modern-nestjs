import type { JsonObject } from 'type-fest'
import z from 'zod'

import { type ChannelID } from './channel.js'
import { asChannelID } from './channel.schema.js'
import {
  asChannelFilterID,
  asChannelFilterKey,
  channelFilterIdSchema,
  channelFilterKeySchema,
  channelFilterSchema,
} from './channel-filter.schema.js'
import type { NetworkID } from './network.js'
import { asNetworkID } from './network.schema.js'

export type ChannelFilterID = z.infer<typeof channelFilterIdSchema>
export type ChannelFilterKey = z.infer<typeof channelFilterKeySchema>

export class ChannelFilter {
  // biome-ignore lint/correctness/noUnusedPrivateClassMembers: Disable structural typing.
  readonly #brand = Symbol(ChannelFilter.name)

  public readonly id: ChannelFilterID
  public readonly key: ChannelFilterKey
  public readonly network: NetworkID
  public readonly name: string
  public readonly position: number
  public readonly channels: ReadonlySet<ChannelID>

  public constructor(data: {
    id: ChannelFilterID
    key: ChannelFilterKey
    network: NetworkID
    name: string
    position: number
    channels: Set<ChannelID>
  }) {
    const { id, key, network, name, position, channels } = channelFilterSchema.parse(data)

    this.id = id
    this.key = key
    this.network = network
    this.name = name
    this.position = position
    this.channels = new Set(channels)
  }

  public static create({
    id,
    key,
    network,
    name,
    position,
    channels,
  }: {
    id: number
    key: string
    network: number
    name: string
    position: number
    channels: Iterable<number>
  }): ChannelFilter {
    return new ChannelFilter({
      id: asChannelFilterID(id),
      key: asChannelFilterKey(key),
      network: asNetworkID(network),
      name,
      position,
      channels: new Set([...channels].map(id => asChannelID(id))),
    })
  }

  public toJSON(): JsonObject {
    return {
      id: this.id,
      key: this.key,
      name: this.name,
      position: this.position,
      channels: [...this.channels],
    }
  }
}
