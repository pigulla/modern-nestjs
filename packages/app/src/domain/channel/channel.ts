import type { JsonObject } from 'type-fest'
import z from 'zod'

import type { NetworkID } from '../network/network.js'
import { asNetworkID } from '../network/network.schema.js'

import {
  asChannelID,
  asChannelKey,
  channelIdSchema,
  channelKeySchema,
  channelSchema,
} from './channel.schema.js'

export type ChannelID = z.infer<typeof channelIdSchema>
export type ChannelKey = z.infer<typeof channelKeySchema>

export class Channel {
  // biome-ignore lint/correctness/noUnusedPrivateClassMembers: Disable structural typing.
  readonly #brand = Symbol(Channel.name)

  public readonly id: ChannelID
  public readonly key: ChannelKey
  public readonly network: NetworkID
  public readonly name: string
  public readonly director: string
  public readonly description: string
  public readonly similarChannels: ReadonlySet<ChannelID>

  public constructor(data: {
    id: ChannelID
    key: ChannelKey
    network: NetworkID
    name: string
    director: string
    description: string
    similarChannels: Set<ChannelID>
  }) {
    const { id, key, network, name, director, description, similarChannels } =
      channelSchema.parse(data)

    this.id = id
    this.key = key
    this.network = network
    this.name = name
    this.director = director
    this.description = description
    this.similarChannels = new Set(similarChannels)
  }

  public static create({
    id,
    key,
    network,
    name,
    director,
    description,
    similarChannels,
  }: {
    id: number
    key: string
    network: number
    name: string
    director: string
    description: string
    similarChannels: Iterable<ChannelID>
  }): Channel {
    return new Channel({
      id: asChannelID(id),
      key: asChannelKey(key),
      network: asNetworkID(network),
      name,
      director,
      description,
      similarChannels: new Set(similarChannels),
    })
  }

  public toJSON(): JsonObject {
    return {
      id: this.id,
      key: this.key,
      network: this.network,
      name: this.name,
      director: this.director,
      description: this.description,
      similarChannels: [...this.similarChannels],
    }
  }
}
