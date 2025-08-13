import type { JsonObject } from 'type-fest'
import z from 'zod'

import { asChannelKey } from '#domain/channel/channel.schema.js'

import type { ChannelKey } from '../channel/channel.js'
import type { NetworkKey } from '../network/network.js'
import { asNetworkKey } from '../network/network.schema.js'

import {
  asChannelFilterKey,
  channelFilterKeySchema,
  channelFilterSchema,
} from './channel-filter.schema.js'

export type ChannelFilterKey = z.infer<typeof channelFilterKeySchema>

export class ChannelFilter {
  // biome-ignore lint/correctness/noUnusedPrivateClassMembers: Disable structural typing.
  readonly #brand = Symbol(ChannelFilter.name)

  public readonly key: ChannelFilterKey
  public readonly networkKey: NetworkKey
  public readonly name: string
  public readonly position: number
  public readonly channels: ReadonlySet<ChannelKey>

  public constructor(data: {
    key: ChannelFilterKey
    networkKey: NetworkKey
    name: string
    position: number
    channels: Set<ChannelKey>
  }) {
    const { key, networkKey, name, position, channels } = channelFilterSchema.parse(data)

    this.key = key
    this.networkKey = networkKey
    this.name = name
    this.position = position
    this.channels = new Set(channels)
  }

  public static create({
    key,
    networkKey,
    name,
    position,
    channels,
  }: {
    key: string
    networkKey: string
    name: string
    position: number
    channels: Iterable<string>
  }): ChannelFilter {
    return new ChannelFilter({
      key: asChannelFilterKey(key),
      networkKey: asNetworkKey(networkKey),
      name,
      position,
      channels: new Set([...channels].map(key => asChannelKey(key))),
    })
  }

  public toJSON(): JsonObject {
    return {
      key: this.key,
      networkKey: this.networkKey,
      name: this.name,
      position: this.position,
      channels: [...this.channels],
    }
  }
}
