import type { JsonObject } from 'type-fest'
import z from 'zod'

import {
  asNetworkID,
  asNetworkKey,
  networkIdSchema,
  networkKeySchema,
  networkSchema,
} from './network.schema.js'

export type NetworkID = z.infer<typeof networkIdSchema>
export type NetworkKey = z.infer<typeof networkKeySchema>

export type NetworkIdentifier = { id: NetworkID } | { key: NetworkKey }

export class Network {
  // biome-ignore lint/correctness/noUnusedPrivateClassMembers: Disable structural typing.
  readonly #brand = Symbol(Network.name)

  public readonly id: NetworkID
  public readonly key: NetworkKey
  public readonly name: string
  public readonly url: string

  public constructor(data: { id: NetworkID; key: NetworkKey; name: string; url: string }) {
    const { id, key, name, url } = networkSchema.parse(data)

    this.id = id
    this.key = key
    this.name = name
    this.url = url
  }

  public static create({
    id,
    key,
    name,
    url,
  }: {
    id: number
    key: string
    name: string
    url: string
  }): Network {
    return new Network({
      id: asNetworkID(id),
      key: asNetworkKey(key),
      name,
      url,
    })
  }

  public toJSON(): JsonObject {
    return {
      id: this.id,
      key: this.key,
      name: this.name,
      url: this.url,
    }
  }
}
