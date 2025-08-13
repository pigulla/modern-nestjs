import type { JsonObject } from 'type-fest'
import z from 'zod'

import type { NetworkKey } from '#domain/network/network.js'
import { asNetworkKey } from '#domain/network/network.schema.js'

import { asChannelKey, channelKeySchema, channelSchema } from './channel.schema.js'

export type ChannelKey = z.infer<typeof channelKeySchema>

export class Channel {
  // biome-ignore lint/correctness/noUnusedPrivateClassMembers: Disable structural typing.
  readonly #brand = Symbol(Channel.name)

  public readonly key: ChannelKey
  public readonly networkKey: NetworkKey
  public readonly name: string
  public readonly director: string
  public readonly description: string
  public readonly similarChannels: ReadonlySet<ChannelKey>

  public constructor(data: {
    key: ChannelKey
    networkKey: NetworkKey
    name: string
    director: string
    description: string
    similarChannels: Set<ChannelKey>
  }) {
    const { key, networkKey, name, director, description, similarChannels } =
      channelSchema.parse(data)

    this.key = key
    this.networkKey = networkKey
    this.name = name
    this.director = director
    this.description = description
    this.similarChannels = new Set(similarChannels)
  }

  public static create({
    key,
    networkKey,
    name,
    director,
    description,
    similarChannels,
  }: {
    key: string
    networkKey: string
    name: string
    director: string
    description: string
    similarChannels: Iterable<ChannelKey>
  }): Channel {
    return new Channel({
      key: asChannelKey(key),
      networkKey: asNetworkKey(networkKey),
      name,
      director,
      description,
      similarChannels: new Set(similarChannels),
    })
  }

  public toJSON(): JsonObject {
    return {
      key: this.key,
      networkKey: this.networkKey,
      name: this.name,
      director: this.director,
      description: this.description,
      similarChannels: [...this.similarChannels],
    }
  }
}
