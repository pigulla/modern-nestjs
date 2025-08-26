import type { JsonObject } from 'type-fest'
import z from 'zod'

import type { NetworkID } from '#domain/network/network.js'
import { asNetworkID } from '#domain/network/network.schema.js'

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
  public readonly networkId: NetworkID
  public readonly name: string
  public readonly director: string
  public readonly description: string
  public readonly similar: ReadonlySet<ChannelID>

  public constructor(data: {
    id: ChannelID
    key: ChannelKey
    networkId: NetworkID
    name: string
    director: string
    description: string
    similar: Set<ChannelID>
  }) {
    const { id, key, networkId, name, director, description, similar } = channelSchema.parse(data)

    this.id = id
    this.key = key
    this.networkId = networkId
    this.name = name
    this.director = director
    this.description = description
    this.similar = new Set(similar)
  }

  public static create({
    id,
    key,
    networkId,
    name,
    director,
    description,
    similar,
  }: {
    id: number
    key: string
    networkId: number
    name: string
    director: string
    description: string
    similar: Iterable<number>
  }): Channel {
    return new Channel({
      id: asChannelID(id),
      key: asChannelKey(key),
      networkId: asNetworkID(networkId),
      name,
      director,
      description,
      similar: new Set([...similar].map(id => asChannelID(id))),
    })
  }

  public toJSON(): JsonObject {
    return {
      id: this.id,
      key: this.key,
      networkId: this.networkId,
      name: this.name,
      director: this.director,
      description: this.description,
      similar: [...this.similar],
    }
  }
}
