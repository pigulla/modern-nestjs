import type { JsonObject } from 'type-fest'
import z from 'zod'

import { asChannelID } from '#domain/channel/channel.schema.js'

import type { ChannelID } from '../channel/channel.js'
import type { NetworkID } from '../network/network.js'
import { asNetworkID } from '../network/network.schema.js'

import {
  asChannelFilterID,
  asChannelFilterKey,
  channelFilterIdSchema,
  channelFilterKeySchema,
  channelFilterSchema,
} from './channel-filter.schema.js'

export type ChannelFilterID = z.infer<typeof channelFilterIdSchema>
export type ChannelFilterKey = z.infer<typeof channelFilterKeySchema>

export class ChannelFilter {
  // biome-ignore lint/correctness/noUnusedPrivateClassMembers: Disable structural typing.
  readonly #brand = Symbol(ChannelFilter.name)

  public readonly id: ChannelFilterID
  public readonly key: ChannelFilterKey
  public readonly networkId: NetworkID
  public readonly name: string
  public readonly position: number
  public readonly channels: ReadonlySet<ChannelID>

  public constructor(data: {
    id: ChannelFilterID
    key: ChannelFilterKey
    networkId: NetworkID
    name: string
    position: number
    channels: Set<ChannelID>
  }) {
    const { id, key, networkId, name, position, channels } = channelFilterSchema.parse(data)

    this.id = id
    this.key = key
    this.networkId = networkId
    this.name = name
    this.position = position
    this.channels = new Set(channels)
  }

  public static create({
    id,
    key,
    networkId,
    name,
    position,
    channels,
  }: {
    id: number
    key: string
    networkId: number
    name: string
    position: number
    channels: Iterable<number>
  }): ChannelFilter {
    return new ChannelFilter({
      id: asChannelFilterID(id),
      key: asChannelFilterKey(key),
      networkId: asNetworkID(networkId),
      name,
      position,
      channels: new Set([...channels].map(id => asChannelID(id))),
    })
  }

  public toJSON(): JsonObject {
    return {
      id: this.id,
      key: this.key,
      networkId: this.networkId,
      name: this.name,
      position: this.position,
      channels: [...this.channels],
    }
  }
}
